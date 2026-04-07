# Fitness Influencer Coaching Platform - Database Architecture

## Overview
I designed this database to help a fitness influencer run their online coaching business. Instead of a traditional gym system, I focused on what an online coach actually needs: managing different clients, selling workout plans, scheduling video calls, and keeping track of weekly check-ins. 

I made sure to separate the money and progress tracking from the basic user information so the system stays fast and easy to understand.

## Main Tables and How They Work

I broke the data down into a few main categories to keep everything organized.

### 1. Users and Profiles
* **Users**: I created this table as the central place for logging in. It holds basic details like first name, last name, email, and a secure password. I also added a role (like Client, Trainer, or Admin) so the system knows exactly who is logging in.
* **Profiles**: I kept extra details, like a trainer's specialty or a client's timezone, in separate profile tables. This keeps the main user table clean and prevents it from getting too cluttered.

### 2. Plans and Money
* **Plans**: I built this table to hold the programs the influencer sells, like a "12-Week Fat Loss" plan or a simple "Consultation Only" package. I kept the workout and diet details flexible here so the coach can easily create new types of programs.
* **Subscriptions**: I consider this the most important link in the database. I use this table to connect a client to a specific plan and a specific trainer. It tracks when the training starts, when it ends, and if the plan is currently active.
* **Payments**: I separated the payment history into its own table. This way, if a client pays in monthly pieces or gets a refund, we can track the money without messing up their actual coaching plan.

### 3. Scheduling Calls
* **Sessions**: I created this table just for live video calls and consultations. It holds the date, time, and the video meeting link. I kept this completely separate from weekly progress updates because a scheduled meeting is a very different event.

### 4. Tracking Progress
* **CheckIns**: I made a specific table for clients to submit their weekly updates. Instead of just updating a single "current weight" number on their profile, this table saves a brand new record every single week. This allows the coach to look back at the history and see how the client is improving over time.
* **Trainer Notes**: I added this table so trainers can write private feedback linked directly to a client's weekly check-in. 

## How the Tables Connect

Here is how I linked the information together:

* **Trainers and Clients**: One trainer can coach many clients at the same time. I handle this by attaching the trainer's ID directly to the client's subscription.
* **Clients and Plans**: A client can buy many different plans over a year, and hundreds of clients can buy the exact same plan. The Subscriptions table acts as the bridge to handle all of these connections.
* **Clients and Check-ins**: One client will submit many check-ins over the months. Each check-in is securely tied to that specific client.

## Why I Made These Choices

1. **Keeping progress separate**: I did not put weight or body measurements in the main user table. We want to see a history of changes to build progress charts, not just overwrite the old numbers.
2. **Calls vs. Updates**: I realized booking a live video call is very different from filling out a weekly weight update form, so I gave them two different tables to prevent confusion.
3. **Flexible Trainers**: By linking the trainer to the Subscription instead of the Client's main profile, I made the system highly flexible. This means a client could potentially have a junior coach for their daily workouts, but book a special consultation with the main influencer without breaking the database.

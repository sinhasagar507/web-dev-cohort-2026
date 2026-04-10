# LiftGrid Systems: Smart Elevator Control Platform

## Project Overview
This repository contains the Database ER Design for LiftGrid Systems, an intelligent elevator management platform designed for large-scale commercial infrastructure. The system is architected to handle multi-building environments, complex elevator-to-floor servicing logic, real-time ride tracking, and comprehensive maintenance auditing.

---

## Database Architecture Breakdown

The system is divided into four logical zones to ensure high performance and scalability:

### 1. Infrastructure (Static Configuration)
* **Buildings:** The root entity representing the physical property.
* **Floors:** Represents specific levels within a building. 
    * Logic: Uses a floor_label (e.g., 'B1', 'L', '14A') to separate physical indexing from display naming.
* **Elevator_Shafts:** Represents the vertical physical space. 
    * Logic: Enforces the rule that one shaft contains exactly one elevator (1:1 relationship).
* **Elevators:** Tracks the physical assets including serial numbers, models, and maximum weight/person capacity.

### 2. Smart Dispatch Logic (Mapping)
* **Serviced_Floors (Junction Table):** Handles the Many-to-Many (M:N) relationship between Elevators and Floors.
    * Purpose: Enables "Express Lifts" (e.g., a lift that only serves the Lobby and Floors 40-50) and restricted-access zones.

### 3. Operational Data (Real-Time Transactions)
* **Floor_Requests:** Captures "Hall Calls." Separates the user's intent (pressing the button) from the actual ride.
* **Ride_Logs:** Stores historical trip data including start/end times and source/destination floors.
    * Edge Case: request_id is nullable to allow for Manual or Technician Overrides where an elevator moves without a user request.
* **Elevator_Status:** A high-frequency table tracking current floor, load weight, and operating mode (Normal, Fire Mode, Maintenance).

### 4. Maintenance and Audit History
* **Maintenance_Logs:** Stores repair history, technician details, and work performed without cluttering the asset table.
* **Elevator_Status_History:** An audit trail for analytics (e.g., calculating uptime and average wait times).

---

## Answering Business Requirements

| Question | Database Solution |
| :--- | :--- |
| How many elevators in a building? | Count Elevators filtered by building_id. |
| Which elevator serves which floors? | Query Serviced_Floors junction table. |
| What is the current elevator status? | Check operating_mode and floor_id in Elevator_Status. |
| Which elevator handled the most requests? | Group by elevator_id in Ride_Logs. |
| Can maintenance be tracked? | Yes, via the Maintenance_Logs table linked by elevator_id. |

---

## Technical Specifications

### Relationship Logic
* **Identifying Relationships (Solid Lines):** Floors and Shafts are weak entities that cannot exist without a Building.
* **Non-Identifying Relationships (Dashed Lines):** Maintenance Logs and Ride Logs are associated with an Elevator but exist as independent historical records.

### Cardinality and Participation
* **Building to Floor:** 1:N (Mandatory - A building must have floors).
* **Elevator to Serviced_Floors:** M:N (Partial - Not all elevators serve all floors).
* **Elevator to Status:** 1:1 (Total - Every elevator must have exactly one real-time status record).

---

## Key Implementation Features
* **Load Balancing:** load_weight_kg in Elevator_Status allows the system to trigger "Bypass Mode" when a car is at capacity.
* **Analytics Ready:** The separation of Floor_Requests and Ride_Logs allows the calculation of Key Performance Indicators (KPIs) such as Average Dispatch Delay.
* **Safety Protocol:** Supports specific status ENUMs including Fire_Override, Inspection, and Out_of_Service.

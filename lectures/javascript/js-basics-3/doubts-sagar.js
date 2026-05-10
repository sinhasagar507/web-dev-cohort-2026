class Debutant {
    constructor(name) {
        this.name = name; 
        this.walkout = function() {
            return `${this.name} walks out to bat for the first time`; 
        }; 
    }
}

const debutant1 = new Debutant("Shubman"); 
const somethingFromLastClass = debutant1.walkout; 
console.log(somethingFromLastClass()); 

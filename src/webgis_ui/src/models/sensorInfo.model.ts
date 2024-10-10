export class SensorInfo {
    date: string = '';         // Formatted date string
    type: string = '';         // Type of the event, e.g., 'Alarm'
    system: string = '';       // System name, e.g., 'SENSOR'
    details: string = '';      // Sensor details, combining sensor name and value
    name: string = '';         // Uppercase sensor name
    imgValue: string = '';     // Sensor value used for image handling
    detect: { [key: string]: number }  ={};       // Detection type (based on logic from detectType method)
    img: string[] = [];        // Image array (initially empty)
    event_id: string = '';     // Event identifier
    recentEventCount:number = 0;
    constructor(data: {
        date: string;
        type: string;
        system: string;
        details: string;
        name: string;
        imgValue: string;
        detect: { [key: string]: number } ;
        img: string[];
        event_id: string;
        recentEventCount:number
    }) {
        this.date = data.date;
        this.type = data.type;
        this.system = data.system;
        this.details = data.details;
        this.name = data.name;
        this.imgValue = data.imgValue;
        this.detect = data.detect;
        this.img = data.img;
        this.event_id = data.event_id;
        this.recentEventCount= data.recentEventCount;
    }

}
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActionCableService } from '../../services/sensors/actioncable.service';
import { SensorDataService } from '../../services/sensors/sensor-data.service';
import { environment } from '../../environments/environment.dev';
import { _SharedModule } from '../_shared/_shared.module';
import { SensorInfo } from '../../models/sensorInfo.model';
import { SharedService } from '../_shared/services/shared.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  isLoading = false;
  eventsData!: SensorInfo[];
  eventFilter: any;
  eventFlterAll!: SensorInfo[];
  columnsConfig = [
    { header: 'วันที่', field: 'date' },
    { header: 'ประเภท', field: 'type' },
    { header: 'ระบบ', field: 'system' },
    { header: 'รายละเอียด', field: 'details' }
  ];
  constructor(private actionCableService: ActionCableService,
    private sensorDataService: SensorDataService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private _sharedSevice: SharedService
  ) { }

  ngOnInit(): void {
    this.actionCableService.subscribeToChannel('SensorDataChannel', null, (data: any) => {
      const newSensor = new SensorInfo({
        date: _SharedModule.formatDateTimeLocal(data.dt),
        type: 'Alarm',
        system: 'SENSOR',
        details: `${data.sensor_name.toUpperCase()} -  ${data.value}`,
        imgValue: data.value,
        name: data.sensor_name.toUpperCase(),
        img: [''],
        event_id: data.event_id,
        detect: this.detectType(data),
        recentEventCount: 0,
      })

      this.eventsData = [...this.eventsData, newSensor].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      this.filterSensorData();
    });

    this.sensorDataService.getAllSensorEvents().subscribe(res => {
      this.updateEventsData(res);
      // Manually trigger change detection to update the view
      this.cdr.detectChanges();
    })

    this._sharedSevice.currentIsLoading.subscribe(x => this.isLoading = x);
  }

  updateEventsData(data: any[]): void {
    // console.log(data);

    this.eventsData = data.map((item: any) => {
      return {
        date: _SharedModule.formatDateTimeLocal(item.dt),
        type: 'Alarm',
        system: 'SENSOR',
        details: `${item.sensor_name.toUpperCase()} -  ${item.value}`,
        name: item.sensor_name.toUpperCase(),
        imgValue: item.value,
        detect: this.detectType(item),
        img: [''],
        event_id: item.event_id,
        recentEventCount: 0
      };
    });

    this.filterSensorData();
    // console.log(this.eventFilter);
  }

  filterSensorData() {
    this.eventFilter = this.eventsData.filter((x: any) => {
      // Exclude events where 'details' ends with any of the image types
      return !environment.typeImg.some((type) => x.details.endsWith(type));
    });

    this.eventFlterAll = this.eventFilter;
    const eventImage = this.eventsData.filter((x: any) => {
      // Exclude events where 'details' ends with any of the image types
      return environment.typeImg.some((type) => x.details.endsWith(type));
    });


    // Create a Set to store unique sensor IDs
    const uniqueSensors = new Set();

    this.eventFilter = this.eventFilter.filter((ele: any) => {
      // Check if the sensor is already in the Set based on a unique property, like sensor_id
      if (!uniqueSensors.has(ele.name)) {
        // Add the sensor_id to the Set if it's unique
        uniqueSensors.add(ele.name);
        return true;  // Keep the element in the filtered array
      }
      return false;  // Remove the element from the filtered array if sensor_id is not unique
    });

    // After filtering unique sensors, you can still process the images
    this.eventFilter.forEach((ele: any) => {

      const [datePart, timePart] = ele.date.split(' ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);

      const oneHourAgo = new Date(year, month - 1, day, hours-1, minutes, seconds);
      ele.img = eventImage
        .filter((x: any) => x.event_id === ele.event_id)  // Filter based on event_id
        .map((x: any) => `${environment.api.replace(':3001/', '')}/${x.imgValue.replace('.jpgg', '.jpg')}`);  // Extract imgValue from each filtered object

      const recentEventCount = this.eventsData
        .filter((x: any) => x.event_id === ele.event_id && new Date(x.date) > oneHourAgo) // Filter by event_id and time
        .length; // Get the count of filtered events

      // You can store the count in the ele object if needed
      ele.recentEventCount = recentEventCount; // Add the count to the element
    });

    this.eventFlterAll.forEach(ele => {
      // Assuming ele.event_time is the timestamp of the event
      const [datePart, timePart] = ele.date.split(' ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);

      const oneHourAgo = new Date(year, month - 1, day, hours-1, minutes, seconds);

      ele.img = eventImage
        .filter((x: any) => x.event_id === ele.event_id) // Filter based on event_id
        .map((x: any) => `${environment.api.replace(':3001/', '')}/${x.imgValue.replace('.jpgg', '.jpg')}`); // Extract imgValue from each filtered object

      // Count events that occurred within the last hour
      const recentEventCount = this.eventsData
        .filter(x => new Date(x.date) > oneHourAgo && x.name === ele.name) // Filter by event_id and time
        .length; // Get the count of filtered events

      // You can store the count in the ele object if needed
      ele.recentEventCount = recentEventCount; // Add the count to the element
    });


    // console.log('this.eventFilter', this.eventFilter);

  }

  detectType(data: any): { [key: string]: number } {
    // console.log(data);

    let type: { [key: string]: number } = {};
    if (!environment.typeImg.some((type) => data.value.endsWith(type))) {

      data.value.split(' ').forEach((entry: any) => {
        const [count, label] = entry.split('-');
        type[(label + '').replace(',', '')] = parseInt(count, 10); // 'H' for human, 'C' for car
      });
    }
    return type;
  }

  onSearch(term: string) {
    // console.log('Searching for:', term);
  }
}

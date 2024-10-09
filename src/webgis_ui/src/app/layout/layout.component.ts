import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActionCableService } from '../../services/sensors/actioncable.service';
import { SensorDataService } from '../../services/sensors/sensor-data.service';
import { environment } from '../../environments/environment.dev';
import { _SharedModule } from '../_shared/_shared.module';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  eventsData: any;
  eventFilter: any;
  columnsConfig = [
    { header: 'วันที่', field: 'date' },
    { header: 'ประเภท', field: 'type' },
    { header: 'ระบบ', field: 'system' },
    { header: 'รายละเอียด', field: 'details' }
  ];
  constructor(private actionCableService: ActionCableService,
    private sensorDataService: SensorDataService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.actionCableService.subscribeToChannel('SensorDataChannel', null, (data: any) => {
      const newSensor = {
        date: _SharedModule.formatDateTimeLocal(data.dt),
        type: 'Alarm',
        system: 'SENSOR',
        details: `${data.sensor_name.toUpperCase()} -  ${data.value}`,
        imgValue: data.value,
        name: data.sensor_name.toUpperCase(),
        img: [''],
        event_id: data.event_id,
        detect: {}
      }
      this.eventsData = [...this.eventsData, newSensor].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      this.eventFilter = this.eventsData.filter((x: any) => {
        // Exclude events where 'details' ends with any of the image types
        return !environment.typeImg.some((type) => x.details.endsWith(type));
      });
  
      const eventImage = this.eventsData.filter((x: any) => {
        // Exclude events where 'details' ends with any of the image types
        return environment.typeImg.some((type) => x.details.endsWith(type));
      });
  
      this.eventFilter.forEach((ele: any) => {
        ele.img = eventImage
          .filter((x: any) => x.event_id === ele.event_id)  // Filter based on event_id
          .map((x: any) => `${environment.api.replace(':3001/', '')}/${x.imgValue.replace('.jpgg', '.jpg')}`);  // Extract imgValue from each filtered object
  
      });
    });

    this.sensorDataService.getAllSensorEvents().subscribe(res => {
      this.updateEventsData(res);
      // Manually trigger change detection to update the view
      this.cdr.detectChanges();
    })
  }

  updateEventsData(data: any[]): void {
    this.eventsData = data.map((item: any) => {
      // Split the value string and count occurrences
      let type: { [key: string]: number } = {};
      if (!environment.typeImg.some((type) => item.value.endsWith(type))) {
        type['HUMAN'] = 0; type['VEHICLE'] = 0; type['OTHERS'] = 0;
        item.value.split(' ').forEach((entry: { split: (arg0: string) => [any, any]; }) => {
          const [count, label] = entry.split('-');
          const upperLabel = label.toUpperCase().replace(',',''); // Convert the label to uppercase for consistency
          
          if (_SharedModule.vehicle_type.some((type) => upperLabel === type)) {
            type['VEHICLE'] += parseInt(count, 10);
          } else if (upperLabel === 'HUMAN') {
            type[upperLabel] = parseInt(count, 10);
          } else {
            type["OTHERS"] += parseInt(count, 10);
          }
        });
      }

      return {
        date: _SharedModule.formatDateTimeLocal(item.dt),
        type: 'Alarm',
        system: 'SENSOR',
        details: `${item.sensor_name.toUpperCase()} -  ${item.value}`,
        name: item.sensor_name.toUpperCase(),
        imgValue: item.value,
        detect: type,
        img: [''],
        event_id: item.event_id
      };
    });
    this.eventFilter = this.eventsData.filter((x: any) => {
      // Exclude events where 'details' ends with any of the image types
      return !environment.typeImg.some((type) => x.details.endsWith(type));
    });

    const eventImage = this.eventsData.filter((x: any) => {
      // Exclude events where 'details' ends with any of the image types
      return environment.typeImg.some((type) => x.details.endsWith(type));
    });

    this.eventFilter.forEach((ele: any) => {
      ele.img = eventImage
        .filter((x: any) => x.event_id === ele.event_id)  // Filter based on event_id
        .map((x: any) => `${environment.api.replace(':3001/', '')}/${x.imgValue.replace('.jpgg', '.jpg')}`);  // Extract imgValue from each filtered object

    });
    // console.log(this.eventFilter);

  }

  onSearch(term: string) {
    // console.log('Searching for:', term);
  }
}

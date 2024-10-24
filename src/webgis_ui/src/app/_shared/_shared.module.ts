

export class _SharedModule{
    public static formatDateTimeLocal(dt : string): string{
        const localTime = new Date(dt);
        const formattedDate = localTime.toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).replace(',', '');

        return formattedDate;
    }

    public static vehicle_type = ['CAR', 'CARS', 'BUS', 'MOTOCYCLE', 'BICYCLE']
}
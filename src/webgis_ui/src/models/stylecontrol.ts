export class StyleControl {
    map: maplibregl.Map | undefined; // Declare the map property
    basicStyle: string;
    satelliteStyle: string;
    private satelliteButton!: HTMLElement; // Store reference to the button
    private isSatellite: boolean = false;
    constructor() {
        this.basicStyle = 'https://api.maptiler.com/maps/basic-v2/style.json?key=89niYR6Aow3J66RlqxlA';
        this.satelliteStyle = 'https://api.maptiler.com/maps/d9a4b917-d11b-4c66-8566-d42eb37737ec/style.json?key=89niYR6Aow3J66RlqxlA';
    }

    onAdd(map: maplibregl.Map) {
        this.map = map;

        // Create a container for the control
        const container = document.createElement('div');
        container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group style-control';

        // Create a div for the satellite style button
        this.satelliteButton = document.createElement('div');
        this.satelliteButton.className = 'style-button satellite';
        this.satelliteButton.innerHTML = '<img style="width:50px; height:50px" src="assets/img/sattellite.jpeg" ></img>';
        this.satelliteButton.addEventListener('click', () => this.toggleStyle());

        // Append the button to the container
        container.appendChild(this.satelliteButton);

        return container;
    }

    toggleStyle(): void {
        this.isSatellite = !this.isSatellite;

        // Toggle between basic and satellite style
        const newStyle = this.isSatellite ? this.satelliteStyle : this.basicStyle;
        this.map?.setStyle(newStyle);

        // Update the image source based on the current style
        const imageSrc = this.isSatellite ? 'assets/img/basic.jpg' : 'assets/img/sattellite.jpeg'; // Adjust paths as necessary
        const imgElement = this.satelliteButton.querySelector('img') as HTMLImageElement;
        imgElement.src = imageSrc; // Change the image source
    }

    onRemove() {
        this.map = undefined;
    }
}


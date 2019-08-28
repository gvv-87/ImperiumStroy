///**
// * Создает гугл-карту
// * @param mapSelector - селектор карты. Лучше отдавать ID
// * @param styles - Стили
// * @param settings - объект со следующей структурой:
// * {
// *      center: {lat: 40.6680149,lng: -74.0778514},
// *      zoom: 17,
// *      markers: [
// *          {lat: 40.6680149,lng: -74.0778514}
// *      ],
// *      disableUI: true,
// *      markerIcon: {
// *          path: "Media/Imp_Img/marker.png",
// *          size: [30, 30],
// *          anchor: [15, 30]
// *      }
// * }
// * @constructor
// */
function GMap(
    mapSelector,
    styles,
    settings) {

    this.defaultSettings = {
        center: {lat: 40.6680149, lng: -74.0778514},
        zoom: 13,
        markers: [],
        disableUI: true,
        markerIcon: {
            path: "Media/Imp_Img/marker.png",
            size: [30, 30],
            anchor: [15, 30]
        }
    };
    this.styles = styles;
    this.settings = Object.assign(this.defaultSettings, settings);
    this.map = document.querySelector(mapSelector);
    this.markers = [];
    this.isInit = false;

    this.init = function () {
        if (this.map == undefined || this.settings == undefined) return;

        try {
            this.gmap = new google.maps.Map(this.map, {
                center: this.settings.center,
                zoom: this.settings.zoom,
                styles: this.styles,
                disableDefaultUI: this.settings.disableUI
            });

            this.icon = {
                url: this.settings.markerIcon.path,
                size: new google.maps.Size(this.settings.markerIcon.size[0], this.settings.markerIcon.size[1]),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(this.settings.markerIcon.anchor[0], this.settings.markerIcon.size[1]),
                scaledSize: new google.maps.Size(this.settings.markerIcon.size[0], this.settings.markerIcon.size[1])
            };

            this.isInit = true;

            for (var i = 0; i < this.settings.markers.length; i++) {
                this.addMarker(this.settings.markers[i]);
            }

            document.dispatchEvent(new Event('mapInit'));
        } catch (e) {
            console.log('Error in map plugin! Text: ' + e.message);
        }
    };

    this.addMarker = function(position){
        if(!this.isInit){
            console.log('Карта еще не активна!');
            return;
        }

        var markr = new google.maps.Marker({
            position: position,
            map: this.gmap,
            icon: this.icon
        });

        this.markers.push(markr);
        return markr;
    }
}
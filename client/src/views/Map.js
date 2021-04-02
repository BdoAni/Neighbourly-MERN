import { Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React,{Component} from 'react' ;
// ***********************************
// import Geocode from 'react-geocode';
// Geocode.setApiKey("AIzaSyAKg4xpvUO6EX3FJpOc-CzxfxZw4zbe3uo");
// Geocode.enableDebug();

export class MapContainer extends Component {
    // To listen for clicks on the <Map /> component, pass the onClick prop://////
    // mapClicked(mapProps, map, clickEvent) {
    // //     // ...
    // // }
    render() {
        return (
            <div class="style">
                
                {/* Main code for google map */}
            <Map  google={this.props.google} zoom={14}>

                <Marker onClick={this.onMarkerClick}
                    name={'Current location'} />

                <InfoWindow onClose={this.onInfoWindowClose}>
                </InfoWindow>
            </Map>
            {/* ******************************************** */}
 {/* // To listen for clicks on the <Map /> component, pass the onClick prop:////// */}
                {/* <Map google={this.props.google}
                    onClick={this.mapClicked} /> */}
                    
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyAKg4xpvUO6EX3FJpOc-CzxfxZw4zbe3uo")
})(MapContainer)
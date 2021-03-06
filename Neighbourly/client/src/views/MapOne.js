import React,{Component} from 'react'
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker, GoogleApiWrapper,  } from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
// import Autocomplete from 'react-google-autocomplete';

import {
    FormControl,
    InputLabel,
    OutlinedInput,
    Checkbox,
    Select,
    Button
} from '@material-ui/core';
import axios from "axios";
const styles = {
    paper: {
        width: "12rem", padding: "1rem", display: "inline-block", verticalAlign: 'text-top'
    },
    input: {
        marginBottom: "1rem"
    },
    button: {
        width: "50%"
    }
}
Geocode.setApiKey("AIzaSyAKg4xpvUO6EX3FJpOc-CzxfxZw4zbe3uo");
Geocode.enableDebug();
class MapOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            city: '',
            area: '',
            state: '',
            mapPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            markerPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            }
        }
    }
    /**
      * Get the current address from the default map position and set those values in the state
      */
    componentDidMount() {
        Geocode.fromLatLng(this.state.mapPosition.lat, this.state.mapPosition.lng)
        .then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);

                console.log('city', city, area, state);

                this.setState({
                    address: (address) ? address : '',
                    area: (area) ? area : '',
                    city: (city) ? city : '',
                    state: (state) ? state : '',
                })
            },
            error => {
                console.error(error);
            }
        );
    };
    /**
      * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
      *
      * @param nextProps
      * @param nextState
      * @return {boolean}
      */
    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.state.markerPosition.lat !== this.props.center.lat ||
            this.state.address !== nextState.address ||
            this.state.city !== nextState.city ||
            this.state.area !== nextState.area ||
            this.state.state !== nextState.state
        ) {
            return true
        } else if (this.props.center.lat === nextProps.center.lat) {
            return false
        }
    }
    /**
      * Get the city and set the city input value to the one selected
      *
      * @param addressArray
      * @return {string}
      */
    getCity = (addressArray) => {
        let city = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
                city = addressArray[i].long_name;
                return city;
            }
        }
    };
    /**
      * Get the area and set the area input value to the one selected
      *
      * @param addressArray
      * @return {string}
      */
    getArea = (addressArray) => {
        let area = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                        area = addressArray[i].long_name;
                        return area;
                    }
                }
            }
        }
    };
    /**
      * Get the address and set the address input value to the one selected
      *
      * @param addressArray
      * @return {string}
      */
    getState = (addressArray) => {
        let state = '';
        for (let i = 0; i < addressArray.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                    state = addressArray[i].long_name;
                    return state;
                }
            }
        }
    };
    /**
      * And function for city,state and address input
      * @param event
      */
    onChange = (event) => {
        // console.log(state)
        this.setState({ [event.target.name]: event.target.value });

    };
    /**
      * This Event triggers when the marker window is closed
      *
      * @param event
     // ********************************************************

     // ***************************************
      */
    onInfoWindowClose = (e) => {
    };
    // *****************************************
    onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();


        Geocode.fromLatLng(newLat, newLng).then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);
                this.setState({
                    address: (address) ? address : '',
                    area: (area) ? area : '',
                    city: (city) ? city : '',
                    state: (state) ? state : '',
                    markerPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                    mapPosition: {
                        lat: newLat,
                        lng: newLng
                    },


                })
            },
            error => {
                console.error(error);
            }
        );
    };

    // ******************************************
    /**
        * When the user types an address in the search box we need to install and import react-google-autocomplete
        * @param place
        */
    onPlaceSelected = (place) => {
        // console.log('plc', place);
        const address = place.formatted_address,
            addressArray = place.address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray),
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();
        // Set these values in the state.
        this.setState({
            address: (address) ? address : '',
            area: (area) ? area : '',
            city: (city) ? city : '',
            state: (state) ? state : '',
            markerPosition: {
                lat: latValue,
                lng: lngValue
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue
            },
        })
    };

    // ***************************************
    render() {
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (
                    <GoogleMap
                        style={{ paddingLeft: '10px',
                            marginTop: '2px'
                    }}
                        google={this.props.google}
                    defaultZoom={this.props.zoom}
                    defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
                    >
                        {/* <InfoWindow onClose={this.onInfoWindowClose}>
                        </InfoWindow> */}
                    {/* // ************************************************************************************************* */}
                    <InfoWindow
                            onClose={this.onInfoWindowClose}
                            position={{ lat: ( this.state.markerPosition.lat + 0.0018 ), lng: this.state.markerPosition.lng }}>
                            <div>
                                <span style={{ padding: 0, margin: 0 }}>{this.state.address}</span>
                            </div>
                            </InfoWindow>
                        <Marker google={this.props.google}
                            name={'Dolores park'}
                            draggable={true}
                            onDragEnd={this.onMarkerDragEnd}
                            position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                        />
                        <Marker/>
                        {/* For Auto complete Search Box */}
                        <Autocomplete
                            style={{
                                width: '100%',
                                height: '30px',
                                paddingLeft: '5px',
                                marginTop: '5px',
                                marginBottom: '100px'
                            }}
                            onPlaceSelected={this.onPlaceSelected}
                            types={['(regions)']}/>

                            </GoogleMap>
                        )
                    )
                );
                
                let map;
                if (this.props.center.lat !== undefined) {
                    map = <div>
                <div>
                            <div className="form-group" style={{ marginTop: '5px', padding: 'px', marginRight: '2px'}}>
                                <label htmlFor="">Area</label>
                                <input type="text" name="area" className="form-control" onChange={this.onChange}  defaultValue={this.state.city} />
                    </div>
                            <div className="form-group" style={{ marginTop: '5px', padding: '5px', marginRight: '2px' }}>
                        <label htmlFor="">City</label>
                                <input type="text" name="city" className="form-control" onChange={this.onChange} defaultValue={this.state.area} />
                    </div>
                            <div className="form-group" style={{ marginTop: '5px', padding: '2px', marginRight: '2px' }} >
                        <label htmlFor="">State</label>
                                <input type="text" name="state" className="form-control" onChange={this.onChange}  defaultValue={this.state.state} />
                    </div>
                            <div className="form-group" style={{ marginTop: '5px', padding: '2px' }}>
                        <label htmlFor="">Address</label>
                                <input type="text" name="address" className="form-control" onChange={this.onChange}  defaultValue={this.state.address} />
                                {/* <button onC >Search</button> */}
                    </div >
                </div >
                <AsyncMap
                            // googleMapURL=" https://maps.googleapis.com/maps/api/js?key=AIzaSyAKg4xpvUO6EX3FJpOc-CzxfxZw4zbe3uo"
                
                    // googleMapURL= "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyAKg4xpvUO6EX3FJpOc-CzxfxZw4zbe3uo"
                        // googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAKg4xpvUO6EX3FJpOc-CzxfxZw4zbe3uo&ll=47.419731,-122.088715&spn=0.004250,0.011579&t=h&iwloc=A&hl=en"
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAKg4xpvUO6EX3FJpOc-CzxfxZw4zbe3uo&libraries=geometry,drawing,places,address&libraries=places"
                            // googleMapURL= 'https://maps.googleapis.com/maps/api/geocode/json?address=${Anfield}%20Rd,%20${Anfield},%20${Liverpool}%20${L4%200TH},%20${United}%20${Kingdom}&key=AIzaSyAKg4xpvUO6EX3FJpOc-CzxfxZw4zbe3uo'
                            // googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAKg4xpvUO6EX3FJpOc-CzxfxZw4zbe3uo&libraries=places"
                    loadingElement={
                        <div style={{ height: `100%` }} />
                    }
                    containerElement={
                        <div style={{ height: this.props.height }} />
                    }
                    mapElement={
                        <div style={{ height: `100%` }} />
                    }
                />
            </div>
        } else {
            map = <div style={{ height: this.props.height }} />
        }
        return (map)
    }
}
export default MapOne










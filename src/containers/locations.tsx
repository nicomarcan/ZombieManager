import {Location} from '../model'
import React from 'react';
import LocationsApi from '../apis/locations'
import {Row} from 'react-bootstrap'
import {RenderLocations} from '../components/render-locations'
import {AddLocation} from '../components/add-location'
import { CSSProperties } from 'styled-components';

const locationsStyle: CSSProperties = {display: 'flex', flexDirection: 'row'};

export class Locations extends React.Component<{}, {locations: Location[], locationsApi: LocationsApi}> {
    constructor(props: {}){
        super(props);
        this.state = {locationsApi: new LocationsApi(), locations: []};
        this.loadLocations.bind(this)();
    }
    render(){
        return(
            <div>
                <Row style={locationsStyle} >
                    {this.state ?  <RenderLocations deleteLocation={this.deleteLocation.bind(this)} locations={this.state.locations} /> : <span>Loading locations</span>}
                </Row>
                <Row className="justify-content-md-center">
                    <AddLocation addLocation = {this.addLocation.bind(this)}/>
                </Row>
            </div>
        )
    }
    
    loadLocations(){
        const locationsApi = this.state.locationsApi;
        locationsApi.getLocationsWithoutZombies().then( (locations: Location[]) =>{
            this.setState({...this.state, locations: locations});
        });
    }

    addLocation(newLocation: Location){
        console.log(newLocation)
        const locationsApi = this.state.locationsApi;
        locationsApi.addLocation(newLocation).then((location) =>{
            this.state.locations.push(location);
            this.setState(this.state);
        });
    }

    deleteLocation(location: Location){
        const locationsApi = this.state.locationsApi;
        locationsApi.deleteLocation(location).then(() =>{
            const locationIndex = this.state.locations.indexOf(location);
            this.state.locations.splice(locationIndex,1);
            this.setState(this.state);
        });
    }
}
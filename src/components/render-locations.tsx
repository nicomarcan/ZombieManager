///
// src/components/locations.tsx
///
import * as React from 'react'
import {Location} from '../model'
import {Card} from 'react-bootstrap'
import { CSSProperties } from 'styled-components';
import {IconButton} from '@material-ui/core'
import {Delete} from '@material-ui/icons'

type RenderLocationsProps = {
    locations: Location[];
    deleteLocation: (location:Location) => void;
}

const locationCardStyle: CSSProperties = {
    width: '18rem', 
    marginLeft: '2rem', 
    marginTop:'2rem', 
    marginBottom:'2rem', 
    borderRadius: '0.7rem' 
}

// Create and export the BoardItem component
export class RenderLocations extends React.Component<RenderLocationsProps, {}> {
    
    render(){
        return this.getLocationsRendered();
    }

    getLocationsRendered(){
        return this.props.locations.map((location) =>{
            return  <Card border="secondary" style={locationCardStyle}  key={location._id}>
                      <Card.Header>
                        {location.title}
                        <IconButton   onClick={() => this.props.deleteLocation(location)}style={{float:'right', padding:0}}>
                            <Delete/>
                        </IconButton>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text>{location.description}</Card.Text>
                      </Card.Body>
                    </Card>
        })
    }
}

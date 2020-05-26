import React, {Component, useCallback}  from 'react';
import {Container, Jumbotron, ListGroup, Row, Col, Form, Button} from 'react-bootstrap'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const ItemTypes = {
    Zombie: 'zombie'
}

interface IZombieListProps{
    locationId: number;
    zombies: Zombie[];
}

interface Zombie{
    id: number;
    name: string;
    locationId: number;
}

interface Location{
    id: number;
    name: string;
}

interface IZombieManagerState{
    zombies: Zombie[];
    locations: Location[];
}

interface IZombieManagerProps{
}

interface IZombieViewProps{
    zombie: Zombie;
}


function ZombieList(props: IZombieListProps){

    const zombiesView =  props.zombies.map((zombie: Zombie) =>
        <ZombieView zombie={zombie}/>
    ); 

    return (
        <ListGroup className="zombieList">
            {zombiesView}
        </ListGroup>
    );
    
}

function ZombieView(props: IZombieViewProps){
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.Zombie },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });
  return (
   <ListGroup.Item  key={props.zombie.id}><div ref={drag}> {props.zombie.name}</div></ListGroup.Item>
  )
  
} 


class ZombieManager extends React.Component<IZombieManagerProps, IZombieManagerState> {
  public zombiesByLocation: Map<number, Zombie[]> = new Map();
  public zombiesByLocationView: JSX.Element[] = [];
  public locationsById: Map<number, Location> = new Map(); 

  constructor(props: IZombieManagerProps){
    super(props);
    this.state = {
        locations: [
            {id:0, name: 'Hospital'}, 
            {id:1, name: 'School'}, 
            {id:2, name: 'Warehouse'}
        ],
        zombies: [
                    {id: 0, name: 'Zombie 1', locationId:2},
                    {id: 1, name: 'Zombie 2', locationId:0},
                    {id: 2, name: 'Zombie 3', locationId:1},
                 ]
    };
    this.state.locations.forEach((location) =>{
        this.locationsById.set(location.id, location);
    })
    this.state.locations.forEach((location: Location) =>{
        this.zombiesByLocation.set(location.id, []);
    });
    this.state.zombies.forEach((zombie: Zombie) => {
        const zombiesForLocation = this.zombiesByLocation.get(zombie.locationId);
        if (zombiesForLocation){
            zombiesForLocation.push(zombie);
        }
    });
    this.zombiesByLocation.forEach((val, key) => { 
        this.zombiesByLocationView.push(
            <Col>
               <h3 className="zombieListLocation">{this.getLocationName(key)}</h3>
               <ZombieList zombies = {val} locationId={key}></ZombieList>
            </Col>
        )
    });
     
  }

  public getLocationName(locationId: number){
      const location =  this.locationsById.get(locationId);
      if (location){
        const zombies = this.zombiesByLocation.get(locationId);
        if (zombies){
            return location.name + '('+ zombies.length+')';
        } else{
            return location.name;
        }
      }
      return '';
  }

  public getLocations(): JSX.Element[]{
    const locations: JSX.Element[] = [];
    this.state.locations.forEach((location) =>{
        locations.push(        
                         <option key={location.id}> {location.name}</option>
                 )
    });
    return locations;
  }

  public getZombies(): JSX.Element[]{
    const zombies: JSX.Element[] = [];
    this.state.zombies.forEach((zombie) =>{
        zombies.push(        
                         <option id={zombie.id.toString()}> {zombie.name}</option>
                 )
    });
    return zombies;
  }

  public getZombieByName(zombieName: string): Zombie | null{
      let foundZombie: Zombie | null = null;
      for (const zombie of this.state.zombies) {
          if (zombie.name === zombieName){
              foundZombie = zombie;
              break;
          }
      };
      return foundZombie;
  }

  public getLocationByName(locationName: string): Location | null{
    let foundLocation: Location | null = null;
    for (const location of this.state.locations) {
        if (location.name === locationName){
            foundLocation = location;
            break;
        }
    };
    return foundLocation;
}

  public moveZombie(event: any, context: any){
    event.preventDefault();

    const location = context.getLocationByName(event.target.location.value);
    if (location){
        const zombies = this.state.zombies.slice();
        zombies.forEach((zombie: Zombie) =>{
            if (zombie.name === event.target.zombie.value){
                zombie.locationId = location.id;
            }
        } );
        this.setState({
            locations: this.state.locations,
            zombies: zombies,
        });
        this.state.locations.forEach((location: Location) =>{
            this.zombiesByLocation.set(location.id, []);
        });
        zombies.forEach((zombie: Zombie) => {
            const zombiesForLocation = this.zombiesByLocation.get(zombie.locationId);
            if (zombiesForLocation){
                zombiesForLocation.push(zombie);
            }
        });
        this.zombiesByLocationView = [];
        this.zombiesByLocation.forEach((val, key) => { 
            this.zombiesByLocationView.push(
                <Col>
                   <h3 className="zombieListLocation">{this.getLocationName(key)}</h3>
                   <ZombieList zombies = {val} locationId={key}></ZombieList>
                </Col>
            )
        });    }
 }

  render(){
    return (
        <Container className="p-3">
            <Row className="zombiesView">
              <Jumbotron>
                <DndProvider backend={HTML5Backend}>
                    <h1 className="header">Zombie Manager</h1>
                    <Row>
                        {this.zombiesByLocationView}
                    </Row>
                </DndProvider>
              </Jumbotron>
            </Row>
            <Row>
            <Form onSubmit={(event: any) => this.moveZombie(event,this)}>
                <Form.Group controlId="zombie">
                    <Form.Label>Zombie</Form.Label>
                    <Form.Control as="select" >
                        {this.getZombies()}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="location">
                    <Form.Label>Destination</Form.Label>
                    <Form.Control as="select">
                        {this.getLocations()}
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Move
                </Button>
                </Form>
            </Row>
        </Container>
    );
    }

}

export default ZombieManager;
///
// src/components/board.tsx
///
import * as React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import styled from 'styled-components'

// Import BoardColumn component
import { BoardColumn } from './board-column'
import { Zombie, Location, LocationsBoard } from '../model';
import LocationsApi from '../apis/locations'

// Create styles board element properties
const BoardEl = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

function getZombies(): Promise<Zombie[]>{
  return fetch('http://localhost:3001/zombies')
  .then(res => res.json())
  .then((data) => {
    return data;
  });
}

function createZombiesById(): Promise<Map<string, Zombie>>{
  return getZombies().then((zombies) =>{
    let zombiesById = new Map<string, Zombie>();
    zombies.forEach((zombie) => zombiesById.set(zombie._id, zombie));
    return zombiesById
  });
}

function createLocationsById(zombiesById: Map<string, Zombie>): Promise<Map<string, Location>>{
  const locationsApi = new LocationsApi();
  return locationsApi.getLocationsWithoutZombies().then((locations) =>{
    const locationsById = assignZombiesAndCreate(locations, zombiesById);
    return locationsById;
  });
}

function assignZombiesAndCreate(locations: Location[], zombiesById: Map<string, Zombie>){
  const locationsById = new Map<string, Location>();
  locations.forEach((location) => locationsById.set(location._id, location));
  return assignZombiesToLocations(zombiesById, locationsById);
}

function assignZombiesToLocations(zombiesById: Map<string, Zombie>, locationsById: Map<string, Location>): Map<string, Location>{
  zombiesById.forEach((zombie: Zombie, key: string) => {
    let location = locationsById.get(zombie.locationId);
    if (location){
      if (!location.zombieIds){
        location.zombieIds = [];
      }
      location.zombieIds.push(zombie._id);
    }
  });
  return locationsById;
}

function getLocationsOrder(): number[]{
  return  [0,1,2];
}

function createLocationsBoard(): Promise<LocationsBoard>{
  return createZombiesById().then(zombiesById => {
    return createLocationsById(zombiesById).then((locationsById) =>{
      const locationsOrder = getLocationsOrder();
      return {
        zombiesById: zombiesById,
        locationsById: locationsById,
        locationsOrder: locationsOrder
      };
    });
  });
}

export class Board extends React.Component<{}, LocationsBoard> {

  // Initialize board state with board data
  constructor(props: {}) {
    super(props);
    createLocationsBoard().then((locationsBoard) =>{
      this.setState(locationsBoard);
    }).catch(err =>{
      console.log('failed creating locations board');
      this.state = {
        zombiesById: new Map<string, Zombie>(),
        locationsById: new Map<string, Location>(),
        locationsOrder: []
      };
    });
  }

  reorderZombieInLocation = (location: Location, oldIndex: number, newIndex: number, zombieId: string) =>{
        if (location === undefined || location.zombieIds === undefined){
          return;
        }
         // Get all item ids in currently active list
         const newZombiesIds = Array.from(location.zombieIds)

         // Remove the id of dragged item from its original position
         newZombiesIds.splice(oldIndex, 1)
   
         // Insert the id of dragged item to the new position
         newZombiesIds.splice(newIndex, 0, zombieId)
   
         // Create new, updated, object with data for columns
         const newLocationStart: Location = {
           ...location,
           zombieIds: newZombiesIds
         }

         let newState = this.state;
         this.state.locationsById.set(newLocationStart._id, newLocationStart)
         this.setState(newState)
  }

  moveZombieToLocation = (from: Location, to: Location, fromIndex: number, toIndex: number, zombieId: string) => {
      if (!from.zombieIds){
        return;
      }
      // Moving items from one list to another
      // Get all item ids in source list
      const newStartZombieIds = Array.from(from.zombieIds)

      // Remove the id of dragged item from its original position
      newStartZombieIds.splice(fromIndex, 1)

      // Create new, updated, object with data for source column
      const newLocationStart: Location = {
        ...from,
        zombieIds: newStartZombieIds
      }
      if (!to.zombieIds){
        return;
      }
      // Get all item ids in destination list
      const newEndZombieIds = Array.from(to.zombieIds)

      // Insert the id of dragged item to the new position in destination list
      newEndZombieIds.splice(toIndex, 0, zombieId)

      // Create new, updated, object with data for destination column
      const newLocationEnd: Location = {
        ...to,
        zombieIds: newEndZombieIds
      }

      this.updateState(zombieId, newLocationStart, newLocationEnd)
  }

  updateState = (zombieId: string, start: Location, end: Location) =>{
    let newState = this.state;
    newState.locationsById.set(start._id, start);
    newState.locationsById.set(end._id, end);
    const updatedZombie = newState.zombiesById.get(zombieId);

    if (updatedZombie !== undefined){
      updatedZombie.locationId = end._id;
      newState.zombiesById.set(zombieId, updatedZombie);
    }
    this.setState(newState)
  }

  // Handle drag & drop
  onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result

    // Do nothing if zombie is dropped outside the list
    if (!destination) {
      return;
    }

    // Do nothing if the zombie is dropped into the same place
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const locationStart = this.state.locationsById.get(source.droppableId)
    const locationEnd = this.state.locationsById.get(destination.droppableId)

    if (!locationStart || !locationEnd){
      return;
    }

    // Moving zombies in the same locations
    if (locationStart === locationEnd) {
      this.reorderZombieInLocation(locationStart, source.index, destination.index, draggableId);
    } else {
      this.moveZombieToLocation(locationStart, locationEnd, source.index, destination.index, draggableId)
    }
  }

  getLocationZombies = (location: Location): Zombie[] =>{
      if (!location.zombieIds || location.zombieIds.length === 0){
        return [];
      }
      const zombies: Zombie[] = [];
      location.zombieIds.forEach(zombieId => {
        const zombie = this.state.zombiesById.get(zombieId);
        if (zombie){
          zombies.push(zombie);
        }
      });
      return zombies;
  }

  generateLocationsBoardsInOrder = (): JSX.Element[] => {
    if (!this.state){
      return [];
    }
    let locationsBoards: JSX.Element[] = []; 
    this.state.locationsById.forEach(location => {
      if (location === undefined){
        return;
      }
      let zombies: Zombie[] = this.getLocationZombies(location);
      // Render the BoardColumn component
      locationsBoards.push(<BoardColumn key={location._id} location={location} zombies={zombies} />);
    });
    return locationsBoards;
  }

  render() {
    return(
      <BoardEl>
        {/* Create context for drag & drop */}
        <DragDropContext onDragEnd={this.onDragEnd}>
          {/* Get all columns in the order specified in 'board-initial-data.ts' */}
          {this.generateLocationsBoardsInOrder()}
        </DragDropContext>
      </BoardEl>
    )
  }
}
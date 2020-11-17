///
// src/components/board-item.tsx
///
import * as React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { Zombie } from '../model';

// Define types for board item element properties
type BoardItemProps = {
  index: number
  zombie: Zombie
}

// Define types for board item element style properties
// This is necessary for TypeScript to accept the 'isDragging' prop.
type BoardItemStylesProps = {
  isDragging: boolean
}

// Create style for board item element
const BoardItemEl = styled.div<BoardItemStylesProps>`
  padding: 8px;
  background-color: ${(props) => props.isDragging ? '#d3e4ee' : '#fff'};
  border-radius: 4px;
  transition: background-color .25s ease-out;

  &:hover {
    background-color: #f7fafc;
  }

  & + & {
    margin-top: 4px;
  }
`

// Create and export the BoardItem component
export const BoardItem = (props: BoardItemProps) => {
  return <Draggable draggableId={props.zombie._id} index={props.index}>
    {(provided, snapshot) => (
      /* The BoardItem */
      <BoardItemEl
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        isDragging={snapshot.isDragging}
      >
        {/* The content of the BoardItem */}
        {props.zombie.name}
      </BoardItemEl>
    )}
  </Draggable>
}
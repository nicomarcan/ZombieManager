import React, { ChangeEvent } from 'react'
import {Location} from '../model'
import {Form, Button} from 'react-bootstrap'
import { CSSProperties } from 'styled-components';
import ImageUploader from 'react-images-upload';

export type AddLocationProps = {
    addLocation: (location: Location) => void
}

export type AddLocationState = {
    locationTitle: string;
    locationDesc: string;
    pictures: File[];
}

const addLocationStyle: CSSProperties = {textAlign: 'center', width: '300px'}

export class AddLocation extends React.Component<AddLocationProps, AddLocationState> {
    constructor(props: AddLocationProps){
        super(props);
        this.state = {locationTitle: '', locationDesc: '', pictures: []};
        this.onImageDrop = this.onImageDrop.bind(this);
    }
    render(){
        return (
            <Form style={addLocationStyle} onSubmit={this.generateLocationAndAdd.bind(this)}>
                <Form.Group controlId="locationTitle">
                    <Form.Label>Location title</Form.Label>
                    <Form.Control value={this.state.locationTitle} type="text" placeholder="Location Title" onChange={this.updateTitle.bind(this)} />
                </Form.Group>
                <Form.Group controlId="locationDesc">
                    <Form.Label>Location Description</Form.Label>
                    <Form.Control value={this.state.locationDesc} type="text" placeholder="Location Description" onChange={this.updateDesc.bind(this)} />
                </Form.Group>
                <ImageUploader
                withIcon={false}
                withPreview={true}
                buttonText='Choose images'
                onChange={this.onImageDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                label={'Upload your location images'}
                />
                <Button variant="primary" disabled={this.isButtonDisabled()} type="submit">
                    Submit
                </Button>
            </Form>
        )
    }

    onImageDrop(pictures: File[]) {
        this.setState({
            ...this.state,
            pictures: this.state.pictures.concat(pictures),
        });
    }

    isButtonDisabled(): boolean{
        return !(this.state.locationDesc !== null && this.state.locationDesc !== '' &&
                this.state.locationTitle !== null && this.state.locationTitle !== '');
    }

    updateTitle(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({...this.state, locationTitle: event.target.value});
    }

    updateDesc(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({...this.state, locationDesc: event.target.value});
    }
    
    generateLocationAndAdd(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const newLocation = {
            title: this.state.locationTitle, 
            description: this.state.locationDesc, 
            _id:'',
            pictures: this.state.pictures,
        }
        this.props.addLocation(newLocation);
        this.setState({...this.state, locationTitle: '', locationDesc: '', pictures: []});
    }

}
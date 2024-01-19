import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticleComponent from './components/ParticleComponent';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';


const initialState = {
    input: '',
    imageUrls: [],
    imageUrlsBeforeSorting: [],
    box: [],
    route: 'signin',
    isSignedIn: false,
    isProfileOpen: false,
    uploadedImages: [],
    uploadedImageUrls: [],
    model: 'general-image-recognition',
    matchingConcepts: [],
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
        pet: '',
        age: ''
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    componentDidMount() {
        const token = window.sessionStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/signin', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token  //ideally it should be 'Authorization': 'Bearer ' + token . Read about it!!!
                }
            })
                .then(resp => resp.json())
                .then(data => {
                    if (data && data.id) {
                        fetch(`http://localhost:3000/profile/${data.id}`, {
                            method: 'get',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        })
                            .then(resp => resp.json())
                            .then(user => {
                                if (user && user.email) {
                                    this.loadUser(user);
                                    this.onRouteChange('home');
                                }
                            })
                    }
                })
                .catch(console.log);
        }
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        })
    }

    findMatchingConcepts = (result) => {
        let conceptIndexMap = {};

        if (result && result.outputs) {
            result.outputs.forEach((output, index) => {
                output.data.concepts.forEach((concept) => {
                    // If the concept hasn't been added to the map, initialize it
                    if (!conceptIndexMap[concept.name]) {
                        conceptIndexMap[concept.name] = [];
                    }
                    // Push the current image index to the array for this concept
                    conceptIndexMap[concept.name].push(index);
                });
            });
        }

        const matchingConcepts = Object.entries(conceptIndexMap)
            .filter(([conceptName, indexes]) => indexes.length >= 2)
            .map(([conceptName, indexes]) => {
                return { conceptName, indexes };
            });

        // Sort the matching concepts by the number of indexes, descending
        matchingConcepts.sort((a, b) => b.indexes.length - a.indexes.length);

        return matchingConcepts;
    }


    calculateFaceLocation = (result) => {
        if (result && result.outputs) {
            const regions = result.outputs[0].data.regions;
            const boxes = [];

            const image = document.getElementById('inputimage');
            const width = Number(image.width);
            const height = Number(image.height);

            regions.forEach(region => {
                const box = {};
                const boundingBox = region.region_info.bounding_box;
                box.topRow = (boundingBox.top_row * height).toFixed(3);
                box.leftCol = (boundingBox.left_col * width).toFixed(3);
                box.bottomRow = (height * boundingBox.bottom_row).toFixed(3);
                box.rightCol = (width * boundingBox.right_col).toFixed(3);
                boxes.push(box);
            });
            return boxes;
        }
        return;
    }

    displayFaceBox = (box) => {
        if (box) {
            this.setState({ box: box });
        }
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onFileUpload = (event) => {
        const files = event.target.files;
        if (files) {

            const allFiles = Array.from(files); // Convert FileList to Array

            allFiles.forEach((file) => {
                this.setState(prevState => ({
                    uploadedImageUrls: [...prevState.uploadedImageUrls, URL.createObjectURL(file)]
                }));
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.setState(prevState => ({
                        uploadedImages: [...prevState.uploadedImages, reader.result]
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // sortByConcept = (imagesIndexes) => {
    //     const filteredUrls = this.state.imageUrls.filter((_, index) => imagesIndexes.includes(index));
    //     this.setState({ imageUrls: filteredUrls });
    // }
    sortByConcept = (imagesIndexes) => {
        const filteredUrls = this.state.imageUrlsBeforeSorting.filter((_, index) => imagesIndexes.includes(index));
        this.setState({ imageUrls: filteredUrls }, () => {
            console.log(this.state.imageUrls);
        });
    }


    onButtonSubmit = () => {
        switch (this.state.model) {
            case 'face-detection':
                if (this.state.input) {
                    this.setState(prevState => ({
                        imageUrls: [...prevState.uploadedImageUrls, this.state.input]
                    }));
                    fetch('http://localhost:3000/image', {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': window.sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            id: this.state.user.id,
                            imageUrl: this.state.input,
                            model: 'face-detection'
                        })
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result) {
                                this.setState(prevState => ({
                                    user: {
                                        ...prevState.user,
                                        entries: parseInt(prevState.user.entries, 10) + 1,
                                    },
                                }));
                            }
                            this.displayFaceBox(this.calculateFaceLocation(result));
                        })
                        .catch(error => console.log('error', error));
                } else if (this.state.uploadedImages) {
                    this.setState({ imageUrls: this.state.uploadedImageUrls });
                    fetch('http://localhost:3000/byteImage', {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': window.sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            id: this.state.user.id,
                            image: this.state.uploadedImages.map(imageUrl => imageUrl.split(',')[1]),
                            model: 'face-detection'
                        })
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result) {
                                this.setState(prevState => ({
                                    user: {
                                        ...prevState.user,
                                        entries: parseInt(prevState.user.entries, 10) + 1,
                                    },
                                }));
                            }
                            this.displayFaceBox(this.calculateFaceLocation(result));
                        })
                        .catch(error => console.log('error', error));
                }
                break;
            case 'general-image-recognition':
                if (this.state.input) {
                    this.setState(prevState => ({
                        imageUrls: [...prevState.uploadedImageUrls, this.state.input],
                        imageUrlsBeforeSorting: [...prevState.uploadedImageUrls, this.state.input]

                    }));
                    fetch('http://localhost:3000/image', {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': window.sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            id: this.state.user.id,
                            imageUrl: this.state.input,
                            model: 'general-image-recognition'
                        })
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result) {
                                this.setState(prevState => ({
                                    user: {
                                        ...prevState.user,
                                        entries: parseInt(prevState.user.entries, 10) + 1,
                                    },
                                }));
                            }
                            console.log(result);
                        })
                        .catch(error => console.log('error', error));
                } else if (this.state.uploadedImages) {
                    this.setState({
                        imageUrls: this.state.uploadedImageUrls,
                        imageUrlsBeforeSorting: this.state.uploadedImageUrls
                    });
                    fetch('http://localhost:3000/byteImage', {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': window.sessionStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            id: this.state.user.id,
                            image: this.state.uploadedImages.map(imageUrl => imageUrl.split(',')[1]),
                            model: 'general-image-recognition'
                        })
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result) {
                                this.setState(prevState => ({
                                    user: {
                                        ...prevState.user,
                                        entries: parseInt(prevState.user.entries, 10) + 1,
                                    },
                                }));
                            }
                            console.log(this.findMatchingConcepts(result));
                            this.setState({ matchingConcepts: this.findMatchingConcepts(result) })
                        })
                        .catch(error => console.log('error', error));
                }
                break;
            default:
            // Handle unknown model if necessary
        }
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            return this.setState(initialState)
        } else if (route === 'home') {
            this.setState({ isSignedIn: true })
        }
        this.setState({ route: route });
    }

    toggleModal = () => {
        this.setState(prevState => ({
            ...prevState,
            isProfileOpen: !prevState.isProfileOpen
        }))
    }

    changeModel = (newModel) => {
        this.setState({ model: newModel });
    }

    render() {
        const { isSignedIn, imageUrls, route, box, isProfileOpen, user, model } = this.state;
        return (
            <div className="App">
                <ParticleComponent />
                <Navigation
                    onRouteChange={this.onRouteChange}
                    isSignedIn={isSignedIn}
                    toggleModal={this.toggleModal} />
                {isProfileOpen &&
                    <Modal>
                        <Profile
                            isProfileOpen={isProfileOpen}
                            toggleModal={this.toggleModal}
                            loadUser={this.loadUser}
                            user={user}
                            changeModel={this.changeModel}
                            model={model} />
                    </Modal>}
                <Logo />
                {route === 'home'
                    ? <div>
                        <Rank name={this.state.user.name} entries={this.state.user.entries} />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}
                            onFileUpload={this.onFileUpload}
                            matchingConcepts={this.state.matchingConcepts}
                            sortByConcept={this.sortByConcept} />
                        <FaceRecognition
                            boxes={box}
                            imageUrls={imageUrls} />
                    </div>
                    : (
                        route === 'signin'
                            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                    )
                }
            </div>
        );
    }
}

export default App;
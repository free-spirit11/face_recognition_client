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
    imageUrl: '',
    box: [],
    route: 'signin',
    isSignedIn: false,
    isProfileOpen: false,
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
                        console.log('from component did mount fetching profile')
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

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                id: this.state.user.id,
                imageUrl: this.state.input
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

    render() {
        const { isSignedIn, imageUrl, route, box, isProfileOpen, user } = this.state;
        return (
            <div className="App">
                <ParticleComponent />
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} toggleModal={this.toggleModal} />
                {isProfileOpen &&
                    <Modal>
                        <Profile
                            isProfileOpen={isProfileOpen}
                            toggleModal={this.toggleModal}
                            loadUser={this.loadUser}
                            user={user} />
                    </Modal>}
                <Logo />
                {route === 'home'
                    ? <div>
                        <Rank name={this.state.user.name} entries={this.state.user.entries} />
                        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                        <FaceRecognition boxes={box} imageUrl={imageUrl} />
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
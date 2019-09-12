import React, {useState} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecon from './components/FaceRecon/FaceRecon';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '2bd168b87ddb47d08e445327f00099a3'
});

const particlesOptions = {
  particles : {
    number: {
      value: 300,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

function App() {
  const [input, setInput] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });
  const [imageUrl, setImageURL] = useState('');

  let onPictureSubmit = () => {
    console.log("submit");
    setImageURL(input);
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      imageUrl)
    .then(response => 
      {
        if (response) {
          fetch('http://localhost:3002/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  id: user.id
              })
          })
          .then(response => response.json())
          .then(count => {
            setUser({...user, entries: count});
          })
        };
        console.log(response);
        displayFaceBox(calculateFaceLoc(response));
      }
    ); 
  };

  let calculateFaceLoc = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  let displayFaceBox = (box) => {
    setBox(box); 
  }

  let loadUser = (data) =>{
    console.log(data);
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    });
  }

  let onRouteChange = (where) => {
    if (where === 'signout'){
      setSignedIn(false);
    } else if (where === 'home'){
      setSignedIn(true);
    }
    setRoute(where);
  }

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}></Navigation>
      { route === 'home' 
      ? <div> 
      <Logo></Logo>
      <Rank name={user.name} entries={user.entries}></Rank>
      <ImageLinkForm value={input} onInputChange={e => setInput(e.target.value)} onPictureSubmit={onPictureSubmit}></ImageLinkForm>
      <FaceRecon box={box} imageUrl={input}></FaceRecon>
      </div> 
      : (
        route === 'signin'
        ? <Signin onRouteChange={onRouteChange} loadUser={loadUser}/>
        : <Register onRouteChange={onRouteChange} loadUser={loadUser}/>)
      }
    </div>
  );
}

export default App;

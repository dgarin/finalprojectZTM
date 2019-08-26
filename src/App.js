import React, {useState} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
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
  let onButtonSubmit = () => {
    console.log("click");
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
    .then(response => setBox(response))
  };

  let calculateFaceLoc = (data) => {

  }

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation></Navigation>
      <Logo></Logo>
      <Rank></Rank>
      <ImageLinkForm value={input} onInputChange={e => setInput(e.target.value)} onButtonSubmit={onButtonSubmit}></ImageLinkForm>
      <FaceRecon imageUrl={input}></FaceRecon>
    </div>
  );
}

export default App;

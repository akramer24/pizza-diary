import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { debounce } from 'lodash';
import { withFirebase } from '../Firebase';
import { mapKey } from '../../secrets';
import pin from './pin.png';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        latitude: 40.7128,
        longitude: -74.0060,
        zoom: 11
      },
      pizzerias: []
    };

    this.updateDimensions = this.updateDimensions.bind(this);
    this.debounceUpdateDimensions = debounce(this.updateDimensions, 100);
  }

  async componentDidMount() {
    const { firebase } = this.props;
    const pizzeriasSnapshot = await firebase.db.collection('pizzerias').get();
    const pizzerias = [];
    pizzeriasSnapshot.forEach(p => pizzerias.push(p.data()));
    this.setState({ pizzerias });
    this.updateDimensions();
    window.addEventListener('resize', this.debounceUpdateDimensions);
    const root = document.getElementById('root');
    const config = { attributes: true, childList: true, subtree: true };
    this.observer = new MutationObserver(this.debounceUpdateDimensions);
    this.observer.observe(root, config);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceUpdateDimensions);
    this.observer.disconnect();
  }

  updateDimensions() {
    const container = document.getElementById('map-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.setState(state => ({ viewport: { ...state.viewport, height, width } }));
  }

  renderPopup(pizzeria) {
    const { latitude, longitude, name } = pizzeria;
    this.setState({
      showPopup: true,
      popup: <Popup
        latitude={latitude}
        longitude={longitude}
        closeButton={true}
        closeOnClick={false}
        onClose={() => this.setState({ showPopup: false })}
        anchor="top"
      >
        <span>{name}</span>
      </Popup>
    })
  }

  render() {
    const { pizzerias, popup, showPopup } = this.state;

    return (
      <div id="map-container">
        <ReactMapGL
          {...this.state.viewport}
          mapboxApiAccessToken={mapKey}
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapStyle='mapbox://styles/mapbox/streets-v11'
        >
          {
            pizzerias.map(p => (
              <Marker key={p.yelpId} latitude={p.latitude} longitude={p.longitude} offsetLeft={-16} offsetTop={-32}>
                <img onClick={() => this.renderPopup(p)} src={pin} height={32} width={32} />
              </Marker>
            ))
          }
          {showPopup && popup}
        </ReactMapGL>
      </div>
    );
  }
}

export default withRouter(withFirebase(Map));
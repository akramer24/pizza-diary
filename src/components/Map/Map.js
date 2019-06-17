import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { debounce } from 'lodash';
import { FaPlus, FaMinus, FaPizzaSlice } from 'react-icons/fa';
import { withFirebase } from '../Firebase';
import { mapKey } from '../../secrets';
import { Modal } from '../index';
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
      pizzerias: [],
      user: {
        pizzeriasToVisit: {},
        pizzeriasVisited: {}
      }
    };

    this.updateDimensions = this.updateDimensions.bind(this);
    this.debounceUpdateDimensions = debounce(this.updateDimensions, 100);
    this.renderModal = this.renderModal.bind(this);
    this.renderPopup = this.renderPopup.bind(this);
    this.addOrRemovePizzeriaToVisit = this.addOrRemovePizzeriaToVisit.bind(this);
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
    const user = firebase.getCurrentUser();
    const userData = await firebase.getUserFromDb(user.uid);
    const { pizzeriasVisited, pizzeriasToVisit } = userData;
    this.setState({ user: { pizzeriasToVisit, pizzeriasVisited } });
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
        <span onClick={() => this.renderModal(pizzeria)}>{name}</span>
      </Popup>
    })
  }

  async addOrRemovePizzeriaToVisit(addOrRemove, pizzeria) {
    const { firebase } = this.props;
    const method = addOrRemove === 'add' ? firebase.addPizzeriaToVisit : firebase.removePizzeriaToVist;
    await method(pizzeria.name, update =>
      this.setState({ user: { pizzeriasToVisit: update.pizzeriasToVisit, pizzeriasVisited: update.pizzeriasVisited } })
    );
    this.renderModal(pizzeria);
  }

  async renderModal(pizzeria) {
    const { name, phone, price } = pizzeria;
    const { pizzeriasVisited, pizzeriasToVisit } = this.state.user;
    const formattedPhone = phone.replace('(', '').replace(')', '').replace(' ', '-');

    ReactDOM.render(
      <Modal className="pizzeria-modal" title={name}>
        {
          pizzeriasVisited[name]
            ? <span>You've already been here!</span>
            : pizzeriasToVisit[name]
              ? (
                <div className="flow-down">
                  <span>You have this on your bucket list!</span>
                  <span>Been here? Add it to your visited list. <FaPlus className="add-remove add" /></span>
                  <span>Don't want to go here anymore? Remove it. <FaMinus className="add-remove remove" onClick={() => this.addOrRemovePizzeriaToVisit('remove', pizzeria)} /></span>
                </div>
              )
              : <span>You have not been here. Add {name} to your bucket list! <FaPlus className="add-remove add" onClick={() => this.addOrRemovePizzeriaToVisit('add', pizzeria)} /></span>
        }
        <div className="pizzeria-info">
          <span><span className="label">Rating: </span><FaPizzaSlice /><FaPizzaSlice /><FaPizzaSlice /><FaPizzaSlice /><FaPizzaSlice /></span>
          <span><span className="label">Price: </span>{price}</span>
          <span><span className="label">Phone: </span><a href={`tel:+1-${formattedPhone}`}>{phone}</a></span>
        </div>
      </Modal>,
      document.getElementById('modal-root')
    )
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
                <img
                  onClick={() => this.renderPopup(p)}
                  onMouseOver={() => this.renderPopup(p)}
                  src={pin}
                  height={32}
                  width={32}
                />
              </Marker>
            ))
          }
          {showPopup && popup}
        </ReactMapGL>
      </div>
    );
  }
}

export default withFirebase(Map);
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ViewPagerAndroid,
  ScrollView,
  Navigator,
  View,
  ListView,
  Dimensions,
  WebView,
  ToastAndroid,
  Button,
  DrawerLayoutAndroid,

} from 'react-native';
const uri_image_menu = 'http://image18-c.poco.cn/mypoco/myphoto/20160605/09/17351665220160605093956066.png';

const { width, height } = Dimensions.get('window');
import SideMenus from './app/activity/App';
class YouYiBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selectedItem: 'About',
    };
  }

  toggle() {
    this.refs.toast.show('toggle', 1000);
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({
      isOpen: isOpen
    });
  }

  onMenuItemSelected = (item) => {
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
  }
  showToast() {
    // this.refs.toast.show(this.state.selectedItem, 1000);

  }
  render() {

    return (
      <SideMenus/>
    );

  }
}

const styles = StyleSheet.create({

  button: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('YouYiBook', () => YouYiBook);

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  WebView,
  Dimensions,
  Platform,
  BackHandler
} from 'react-native';

const { width, height } = Dimensions.get('window');
var BACK_ICON = require('../img/nav_return.png');
import PublicTitle from './public_title';
var nav;
export default class WebViewActivity extends Component {

  constructor(props) {
    super(props);
    nav = this.props.navigator;
    this.state = {

      rootUrl: '',
      title: '',

    }
  }

  backOnclick() {

    nav.pop(
      {

      }
    );

  }
  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', function () {
    // });
  }

  componentDidMount() {

    // BackHandler.addEventListener('hardwareBackPress', function () {
    //   if (nav) {
    //     nav.pop();
    //     return true;

    //   } else {
    //     return false;
    //   }
    // });
    this.setState({

      rootUrl: this.props.root_url,
      title: this.props.title,

    })
  }
  render() {
    return (
      <View style={styles.container}>
        <PublicTitle text={this.state.title} _backOnclick={this.backOnclick.bind(this)} left_icon={BACK_ICON} />
        <WebView
          style={{ width: width, height: height - 20 }}
          source={{ uri: this.state.rootUrl, method: 'GET' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    backgroundColor: '#f2f2f2',
  },
});

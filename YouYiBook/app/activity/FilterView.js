import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    StatusBar,
    Image,
    TouchableOpacity,
} from 'react-native';

var { height, width } = Dimensions.get('window');
import PublicTitle from '../activity/book_public_title';
const ITEMICON = require('../img/bookstore_lead_sign.png');
const FINISHICON = require('../img/btn_titel_finish.png');
import CityPicker from '../view/city_picker';
const BACKICON = require('../img/btn_titel_back.png');
export default class FilterActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            publishName: '所有',
            cityName: '所有',
            publishId: '',
            show_city_picker: false,
            provinceId: '',
            cityIds: '',
        };

    }
    /**
           * 选择城市
           */
    selectCity() {
        this.setState({

            show_city_picker: true
        })
    }
    componentDidMount() {
    }
    finishOnlcik = () => {
        const { navigate, goBack, state } = this.props.navigation;
        var pId = this.state.publishId;
        var prId = this.state.provinceId;
        var cId = this.state.cityIds;
        state.params.callback(pId, prId, cId);
        goBack();
    }
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    _goPublishActivity() {

        const { navigate } = this.props.navigation;
        navigate('publisherView', {
            // 跳转的时候携带一个参数去下个页面
            callback: (data) => {
                this.setState({
                    publishName: data.publisher_name,
                    publishId: data.publisher_id

                })
            }
        });
    }
    _goCityActivity() {

        this.selectCity();

    }
    pushDetails() {
        var cityEntity = this.refs.cPicker.passMenthod();
        var place = cityEntity.province + ' ' + cityEntity.city;
        this.setState({

            cityName: place,
            show_city_picker: false,
            provinceId: cityEntity.provinceid,
            cityIds: cityEntity.cityid

        })
    }
    render() {

        return (
            <View style={styles.page}>
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='筛选' leftIcon={BACKICON} finishIcon={FINISHICON} imgWidth={39} imgHeight={30} />
                <View style={{ height: 1, width: width, backgroundColor: '#00B11D' }} />
                <View style={styles.main_bg}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this._goPublishActivity()}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, width: width - 20, }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Text style={{ color: '#000000', fontSize: 14 }}>按出版社</Text>
                                <Text style={{ color: '#666666', fontSize: 14, marginLeft: 10 }}>{this.state.publishName}</Text>

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Image style={{ height: 18, width: 12, marginRight: 10 }} source={ITEMICON} />

                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: '#e2e2e2', height: 1, width: width - 20 }}></View>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this._goCityActivity()}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, width: width - 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Text style={{ color: '#000000', fontSize: 14 }}>按出版社所在地区</Text>
                                <Text style={{ color: '#666666', fontSize: 14, marginLeft: 10 }}>{this.state.cityName}</Text>

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Image style={{ height: 18, width: 12, marginRight: 10 }} source={ITEMICON} />

                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <CityPicker visible={this.state.show_city_picker} callbackParent={() => this.pushDetails()} ref="cPicker" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }, main_bg: {
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e2e2e2',
        margin: 10



    }
});
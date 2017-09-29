import React, { Component } from 'react';
import {
    AppRegistry,
    ListView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    StatusBar,
    Image,
    InteractionManager,
    FlatList,
    Dimensions,
    TextInput

} from 'react-native';
import LoadView from '../view/loading';
import NetUitl from '../utils/netUitl';
var { height, width } = Dimensions.get('window');
import StringBufferUtils from '../utils/StringBufferUtil';
var BASEURL = '';
import Global from '../utils/global';
import StringUtil from '../utils/StringUtil';
import { CachedImage } from "react-native-img-cache";
import { toastShort } from '../utils/ToastUtil';
const BACKICON = require('../img/btn_titel_back.png');
import CustomBtn from '../view/CustomButton';
const STAREICON = require('../img/import_icon.png');
import PublicTitle from '../activity/book_public_title';
var addressEntity = null;
import CityPicker from '../view/city_picker';
import stringUtil from '../utils/StringUtil';
var type = '0';
export default class EditAddressActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            receiveName: '',
            phone: '',
            tel: '',
            detail: '',
            postCode: '',
            cityName: '',
            publishId: '',
            show_city_picker: false,
            provinceId: '',
            cityIds: '',
        };
    }

    componentDidMount() {
        type = this.props.navigation.state.params.type
        if (type == '0') {//编辑模式
            BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/user/delivery_mod';
            addressEntity = this.props.navigation.state.params.addressEntity;
            this.fillView();
        } else {//新增模式
            BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/user/delivery_add';

        }


    }
    fillView() {

        if (null != addressEntity) {

            this.setState({
                receiveName: addressEntity.name,
                phone: addressEntity.phone,
                tel: addressEntity.tel,
                cityName: addressEntity.area,
                detail: addressEntity.address,
                postCode: addressEntity.postcode,
                provinceId: addressEntity.province,
                cityIds: addressEntity.city,



            })
        }

    }
    componentWillUnmount() {
    }

    saveData(addressEntity) {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('username=' + Global.userName);
        StringBufferUtils.append('&&delivery_id=' + addressEntity.delivery_id);
        StringBufferUtils.append('&&name=' + addressEntity.name);
        StringBufferUtils.append('&&phone=' + addressEntity.phone);
        StringBufferUtils.append('&&tel=' + addressEntity.tel);
        StringBufferUtils.append('&&area=' + addressEntity.area);
        StringBufferUtils.append('&&address=' + addressEntity.address);
        StringBufferUtils.append('&&postcode=' + addressEntity.postcode);
        StringBufferUtils.append('&&province=' + addressEntity.province);
        StringBufferUtils.append('&&city=' + addressEntity.city);
        StringBufferUtils.append('&&isDefault=' + addressEntity.isDefault);
        let params = StringBufferUtils.toString();
        this.fetchData(params);
    }
    // 数据请求
    fetchData(params) {
        const { navigate, goBack, state } = this.props.navigation;
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            console.log(responseData);
            if (null != responseData && responseData.return_code == '0') {
                toastShort('编辑成功！');
                that.setState({
                    show: false
                })

                state.params.callback();
                goBack();

            } else {
                that.setState({
                    show: false
                });

            }
        })
    }
    submitSave() {

        var receive_name = this.state.receiveName;
        var phone_txt = this.state.phone;
        var tel_txt = this.state.tel;
        var area = this.state.cityName;
        var detail_txt = this.state.detail;



        if (!stringUtil.isNotEmpty(receive_name)) {
            toastShort('请输入收货人姓名');
            return;
        }
        if (!stringUtil.isNotEmpty(phone_txt)) {
            toastShort('请输入手机号码');
            return;
        }
        if (!stringUtil.isNotEmpty(area)) {
            toastShort('请选择所属地区');
            return;
        }
        if (!stringUtil.isNotEmpty(detail_txt)) {
            toastShort('请输入详细地址');
            return;
        }

        var obj = new Object();
        obj.name = this.state.receiveName;
        obj.phone = this.state.phone;
        obj.tel = this.state.tel;
        obj.area = this.state.cityName;
        obj.address = this.state.detail;
        obj.postcode = this.state.postCode;
        obj.province = this.state.provinceId;
        obj.city = this.state.cityIds;
        this.saveData(obj);
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }

    //此函数用于为给定的item生成一个不重复的key
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    finishOnlcik = () => {
        this.submitSave();

    }
    /**
    * 选择城市
     */
    selectCity() {
        this.setState({

            show_city_picker: true
        })
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
        let self = this;
        return (
            <View style={styles.container}>
                {this.state.show == true ? (<LoadView />) : (null)}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='编辑收货地址' leftIcon={BACKICON} finishIcon={require('../img/btn_title_submit.png')} imgWidth={39} imgHeight={30} />

                <View style={styles.main_bg}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={STAREICON} style={{ width: 8, height: 8, marginLeft: 10 }} />
                            <Text style={styles.news_item_title}>收货人姓名:</Text>
                            <TextInput
                                style={{ width: width - 130, height: 36, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入收货人姓名' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(receiveName) => this.setState({ receiveName })}
                                value={this.state.receiveName}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                            <Image source={STAREICON} style={{ width: 8, height: 8, marginLeft: 10 }} />
                            <Text style={styles.news_item_title}>手机号码:</Text>
                            <TextInput
                                style={{ width: width - 130, height: 36, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入手机号码' placeholderTextColor='#999999' underlineColorAndroid='transparent' maxLength={11}
                                onChangeText={(phone) => this.setState({ phone })}
                                value={this.state.phone}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 28 }}>
                            <Text style={styles.news_item_title}>固定电话:</Text>
                            <TextInput
                                style={{ width: width - 130, height: 36, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入固定电话' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(tel) => this.setState({ tel })}
                                value={this.state.tel}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                            <Image source={STAREICON} style={{ width: 8, height: 8, marginLeft: 10 }} />
                            <Text style={styles.news_item_title}>所属地区:</Text>
                            <Text style={{ marginLeft: 10, width: width - 130, padding: 5 }} onPress={() => this._goCityActivity()}>{this.state.cityName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                            <Image source={STAREICON} style={{ width: 8, height: 8, marginLeft: 10 }} />
                            <Text style={styles.news_item_title}>详细地址:</Text>
                            <TextInput
                                style={{ width: width - 130, height: 36, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入详细地址' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(detail) => this.setState({ detail })}
                                value={this.state.detail}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 28 }}>
                            <Text style={styles.news_item_title}>邮政编码:</Text>
                            <TextInput
                                style={{ width: width - 130, height: 36, backgroundColor: 'white', paddingTop: 10 }}
                                placeholder='请输入邮政编码' placeholderTextColor='#999999' underlineColorAndroid='transparent'
                                onChangeText={(postCode) => this.setState({ postCode })}
                                value={this.state.postCode}
                            />
                        </View>
                    </View>
                </View>
                <CityPicker visible={this.state.show_city_picker} callbackParent={() => this.pushDetails()} ref="cPicker" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    standalone: {
        marginTop: 30,
        marginBottom: 30,
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    backTextWhite: {
        color: '#FFF',
        textAlign: 'center'
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 130,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 80,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 60,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        height: 130,
        marginTop: 1,

    },
    controls: {
        alignItems: 'center',
        marginBottom: 30
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5
    },
    switch: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        width: 100,
    },
    top_name: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#000000',
        fontSize: 14,
    }, top_select_name: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#ff9602',
        fontSize: 14,
    }, main_bg: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e2e2e2',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width: width - 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',


    }
});

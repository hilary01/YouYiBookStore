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
    Dimensions

} from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import LoadView from '../view/loading';
import NetUitl from '../utils/netUitl';
var { height, width } = Dimensions.get('window');
import StringBufferUtils from '../utils/StringBufferUtil';
var BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/user/queryDelivery';
const DELETEURL = 'http://121.42.238.246:8080/unitrip_bookstore/user/delivery_del';
const DEFAULTADDRESSURL = 'http://121.42.238.246:8080/unitrip_bookstore/user/delivery_mod_default';
import Global from '../utils/global';
import StringUtil from '../utils/StringUtil';
import { CachedImage } from "react-native-img-cache";
import { toastShort } from '../utils/ToastUtil';
import PublicTitle from '../activity/book_public_title';
const BACKICON = require('../img/btn_titel_back.png');
import CustomBtn from '../view/CustomButton';
export default class BookAddressActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
        this._data = [];
    }

    componentDidMount() {
        this.getData();
    }
    componentWillUnmount() {
        this._data = [];
    }

    getData() {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('username=' + Global.userName);
        StringBufferUtils.append('&&page=' + '0');
        StringBufferUtils.append('&&count=' + 100);
        let params = StringBufferUtils.toString();
        this.fetchData(params);
    }
    // 数据请求
    fetchData(params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            console.log(responseData);
            if (null != responseData && responseData.return_code == '0') {
                that.addItemKey(responseData.deliverys);
                that.setState({
                    show: false

                })

            } else {
                that.setState({
                    show: false
                });

            }
        })
    }
    //整合数据
    addItemKey(rulelist) {
        var that = this;
        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据

            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].key = rulelist[i].book_id;
            }

            that._data = that._data.concat(rulelist);


            that.setState({
                dataSource: that.state.dataSource.cloneWithRows(that._data),
                show: false
            });


        } else {
            that.setState({
                show: false,
            });
        }


    }
    deleteRow(data, rowId) {
        var that = this;
        this.setState({
            show: true

        })
        that.getDeleteData(data.delivery_id, rowId);
    }

    /**
     * 删除版权
     * @param {*} id 
     */
    deleteMethord(id, rowId) {
        var list = this._data;
        //移除列表中下标为index的项
        delete list[rowId];
        //更新列表的状态
        this._data = list;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            show: false
        });
        toastShort('删除成功！');

    }
    getDeleteData(id, rowId) {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('username=' + Global.userName);
        StringBufferUtils.append('&&delivery_id=' + id);
        StringBufferUtils.append('&&type=' + 'android');
        let params = StringBufferUtils.toString();
        this.fetchDeleteData(params, id, rowId);
    }
    // 数据请求
    fetchDeleteData(params, id, rowId) {
        var that = this;
        console.log(DELETEURL + params);
        NetUitl.post(DELETEURL, params, '', function (responseData) {
            console.log(responseData);
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                that.deleteMethord(id, rowId);
                that.setState({
                    show: false

                })

            } else {
                if (null != responseData && responseData.return_code == '400') {

                    const { navigate } = this.props.navigation;
                    navigate('LoginView', {
                    });

                }
                that.setState({
                    show: false
                });

            }
        })
    }

    getSetDefaultAddress(id, rowId) {
        this.setState({
            show: true
        });
        StringBufferUtils.init();
        StringBufferUtils.append('username=' + Global.userName);
        StringBufferUtils.append('&&delivery_id=' + id);
        StringBufferUtils.append('&&type=' + 'android');
        let params = StringBufferUtils.toString();
        this.fetchDefaultData(params, id, rowId);
    }
    updateDefaultAddress(rowId) {
        var list = this._data;
        if (null != list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                list[i].isDefault = '0';

            }
            list[rowId].isDefault = '1';

        }
        toastShort('设置默认地址成功！');



    }
    // 数据请求
    fetchDefaultData(params, id, rowId) {
        var that = this;
        console.log(DEFAULTADDRESSURL + params);
        NetUitl.post(DEFAULTADDRESSURL, params, '', function (responseData) {
            console.log(responseData);
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                that.updateDefaultAddress(rowId);
                that.setState({
                    show: false

                })

            } else {
                if (null != responseData && responseData.return_code == '400') {

                    const { navigate } = this.props.navigation;
                    navigate('LoginView', {
                    });

                }
                that.setState({
                    show: false
                });

            }
        })
    }
    //点击列表点击每一行
    clickItem(item) {
        const { navigate } = this.props.navigation;
        navigate('EditAddressView', {
            addressEntity: item,
            type: '0',
            // 跳转的时候携带一个参数去下个页面
            callback: () => {
                this._data = [];
                this.getData();
            }
        });
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _renderDefaultAddress(itemData, rowId) {

        if (null != itemData.isDefault && itemData.isDefault == '1') {
            return <View style={{ flexDirection: 'row' }}>
                <Text style={styles.news_item_title}>收货人姓名:{itemData.name}</Text>
                <Text style={{ color: '#E1300E', marginLeft: 50 }}>默认地址</Text>
            </View>
        } else {
            return <View style={{ flexDirection: 'row' }}>
                <Text style={styles.news_item_title}>收货人姓名:{itemData.name}</Text>
                <View style={{ marginLeft: 50 }}>
                    <CustomBtn textColor='white' textSize={14} btnTxt='设为默认地址' _BtnOnlcik={() => this.defaultClick(itemData, rowId)} bgColor='#23BD00' btnWidth={110} btnHeight={30} />
                </View>
            </View>

        }
    }

    // 返回国内法规Item
    _renderSearchItem = (itemData, rowId) => {
        return (
            <View style={styles.main_bg}>
                <TouchableOpacity onPress={() => this.clickItem(itemData, rowId)} activeOpacity={0.8}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width, }}>
                            <View style={{ height: 130, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 10 }}>
                                {this._renderDefaultAddress(itemData, rowId)}
                                <Text style={styles.news_item_title}>手机号码:{itemData.phone}</Text>
                                <Text style={styles.news_item_title} >固定电话:{itemData.tel}</Text>
                                <Text style={styles.news_item_title} >所属地区:{itemData.area}</Text>
                                <Text style={styles.news_item_title} >详细地址:{itemData.address}</Text>
                                <Text style={styles.news_item_title} >邮政编码:{itemData.postcode}</Text>
                            </View>
                            <View style={{ justifyContent: 'flex-end', marginRight: 10, width: 40, alignItems: 'flex-end' }}>

                                <Image source={require('../img/icon_more.png')} style={{ width: 14, height: 14 }} />
                            </View>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#e2e2e2', width: width }} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
    //此函数用于为给定的item生成一个不重复的key
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    _keyExtractor = (item, index) => item.key;
    finishOnlcik = () => {

    }
    onClick(flag) {
        switch (flag) {
            case '1'://收货地址
                const { navigate } = this.props.navigation;
                navigate('EditAddressView', {
                    type: '1',
                    // 跳转的时候携带一个参数去下个页面
                    callback: () => {
                        this._data = [];
                        this.getData();
                    }
                });
                break;

        }


    }
    defaultClick(item, rowId) {//设置默认地址

        this.getSetDefaultAddress(item.delivery_id, rowId);
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
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='收货地址' finishIcon={null} leftIcon={BACKICON} />
                <SwipeListView
                    dataSource={this.state.dataSource}
                    renderRow={(data, secId, rowId, rowMap) => (
                        <SwipeRow
                            disableLeftSwipe={false}
                            disableRightSwipe={true}
                            leftOpenValue={0}
                            rightOpenValue={-80}
                        >
                            <View style={styles.rowBack}>
                                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={_ => this.deleteRow(data, rowId)}>
                                    <Text style={styles.backTextWhite}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                            {this._renderSearchItem(data, rowId)}
                        </SwipeRow>
                    )}
                />

                <View style={{ width: width, alignItems: 'center', marginTop: 10, position: 'absolute', bottom: 10 }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>

                        <CustomBtn textColor='white' textSize={14} btnTxt='添加收货地址' _BtnOnlcik={() => this.onClick('1')} bgColor='#E2320E' btnWidth={width - 40} btnHeight={30} />
                    </View>
                </View>
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
        height: 131,
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
        height: 131,
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
        alignItems: 'center',
        height: 131,
        justifyContent: 'center',
        backgroundColor: 'white'

    }
});

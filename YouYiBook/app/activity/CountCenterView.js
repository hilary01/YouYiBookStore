import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    StatusBar
} from 'react-native';

var { height, width } = Dimensions.get('window');
import { CachedImage } from "react-native-img-cache";
import LoadView from '../view/loading';
import Global from '../utils/global';
import NetUitl from '../utils/netUitl';
import StringBufferUtils from '../utils/StringBufferUtil';
import stringUtil from '../utils/StringUtil';
import DeviceStorage from '../utils/deviceStorage';
import PublicTitle from '../activity/book_public_title';
const BACKICON = require('../img/btn_titel_back.png');
const SUBMITICON = require('../img/btn_title_submitorder.png');
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/addOrder';
import { toastShort } from '../utils/ToastUtil';
export default class CountCenterActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            totalMoney: '0.00',
            totalCount: 0,
            show: false,
            books: {}
        };

    }

    componentDidMount() {
        var bookInfo = this.props.navigation.state.params.bookInfos;
        this.setState({
            books: bookInfo,
            totalMoney: bookInfo.e_price,
            totalCount: 1


        })

    }
    //点击列表点击每一行
    clickItem(itemData, index) {

    }
    getData(booklist) {
        this.setState({
            show: true
        })
        StringBufferUtils.init();
        StringBufferUtils.append('username=' + Global.userName);
        StringBufferUtils.append('&&order_sum=' + this.state.totalMoney);
        StringBufferUtils.append('&&order_type=' + '0');
        StringBufferUtils.append('&&total=' + this.state.totalMoney);
        StringBufferUtils.append('&&delivery_name=' + '0');
        StringBufferUtils.append('&&delivery_id=' + '0');
        StringBufferUtils.append('&&post_name=' + '0');
        StringBufferUtils.append('&&post_price=' + '0');
        StringBufferUtils.append('&&bookList=' + booklist);
        let params = StringBufferUtils.toString();
        this.fetchData(params);

    }
    // 数据请求
    fetchData(params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                that.setState({
                    show: false
                })
                console.log(responseData.order_sn);
                toastShort('提交订单成功！');
            } else {
                that.setState({
                    show: false
                });

            }
        })
    }
    finishOnlcik = () => {


        if (Global.isLogin != null && Global.isLogin != undefined && Global.isLogin == true) {

            if (stringUtil.isNotEmpty(this.getBookListStr())) {

                this.getData(this.getBookListStr());

            }
        } else {
            const { navigate } = this.props.navigation;
            navigate('LoginView', {
            });

        }

    }
    getBookListStr() {

        var bookEntitys = this.state.books;
        var book = '';
        if (null != bookEntitys) {

            book = bookEntitys.book_id + ':' + 1 + ':' + bookEntitys.e_price + ':' + bookEntitys.book_name;

        }
        return book;


    }
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    _keyExtractor = (item, index) => item.key;
    render() {
        var book = this.state.books;
        return (
            <View style={styles.container}>
                {this.state.show == true ? (<LoadView />) : (null)}
                < StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='结算中心' finishIcon={SUBMITICON} leftIcon={BACKICON} imgWidth={56} imgHeight={30} />
                <View style={{ flexDirection: 'row', width: width, height: 45, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Text>预估金额
                         (<Text style={{ color: '#DF4A0C' }}>
                                ¥{this.state.totalMoney}
                            </Text>)

                        </Text>

                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Text>商品数量
                         (<Text >
                                {this.state.totalCount}
                            </Text>)

                        </Text>

                    </View>

                </View>
                <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                <View style={styles.main_bg}>
                    <Text style={{ color: '#000000', paddingLeft: 10, paddingTop: 10 }}>支付方式</Text>
                    <Text style={{ color: '#666666', paddingLeft: 10, paddingTop: 5, paddingBottom: 5 }}>在线支付-支付宝</Text>
                </View>
                <Text style={{ color: '#000000', paddingLeft: 20, paddingTop: 10 }}>商品明细</Text>
                <View style={styles.main_bg}>
                    <View style={{ flexDirection: 'row', width: width - 20, justifyContent: 'space-between' }}>

                        <Text style={{ color: '#000000', padding: 10, width: width / 2 - 20 }}>{book.book_name}</Text>
                        <Text style={{ color: '#000000', padding: 10, width: width / 2 - 20, textAlign: 'right' }}>1本</Text>
                    </View>
                    <View style={{ height: 1, width: width, backgroundColor: '#e2e2e2' }} />
                    <View style={{ flexDirection: 'row', width: width - 20, justifyContent: 'space-between' }}>

                        <Text style={{ color: '#000000', padding: 10, width: width / 2 - 20 }}>商品总额（预估）</Text>
                        <Text style={{ color: '#DF4A0C', padding: 10, width: width / 2 - 20, textAlign: 'right' }}>{this.state.totalMoney}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: width - 20, justifyContent: 'space-between' }}>

                        <Text style={{ color: '#000000', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, width: width / 2 - 20 }}>您需支付</Text>
                        <Text style={{ color: '#DF4A0C', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, width: width / 2 - 20, textAlign: 'right' }}>{this.state.totalMoney}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f3f3',
        flex: 1
    }, main_bg: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e2e2e2',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width: width - 20



    }
});
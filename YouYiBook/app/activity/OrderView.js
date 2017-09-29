import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ListView,
    TouchableOpacity,
    Dimensions,
    InteractionManager,
    StatusBar,
    Platform
} from 'react-native';
import ViewPager from 'react-native-viewpager';
import NetUitl from '../utils/netUitl';
import LoadView from '../view/loading';
import StringBufferUtils from '../utils/StringBufferUtil';
import stringUtil from '../utils/StringUtil';
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/queryOrder'
var pageNum = 0;
var isLastPage = false;
const TITLELOG = require('../img/title_logo.png');
const { width, height } = Dimensions.get('window');
import {
    SwRefreshListView, //支持下拉刷新和上拉加载的ListView
    // RefreshStatus, //刷新状态 用于自定义下拉刷新视图时使用
    // LoadMoreStatus //上拉加载状态 用于自定义上拉加载视图时使用
} from 'react-native-swRefresh';
import { CachedImage } from "react-native-img-cache";
import Global from '../utils/global';
var orderType = '0';//0:电子,1:纸质
var orderStatus = '0';//0:未支付，1:已支付
const BACKICON = require('../img/btn_titel_back.png');
import PublicTitle from '../activity/book_public_title';
const BOTTOMICON = require('../img/tab_menu_selected.png');
const LABLENOICON = require('../img/null_image.png');
import CustomBtn from '../view/CustomButton';
var menus = ['未支付', '已支付'];
import ModalDropdown from '../view/ModalDropdown';
const DEMO_OPTIONS_1 = ['电子书订单', '纸质书订单'];
export default class OrderViewActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            isLoadMore: false,
            dataListViewSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            title: '电子书订单',
            menuList: [],
        }
        this._data = [];
    }
    componentDidMount() {
        this.initMenu();
        let timer = setTimeout(() => {
            clearTimeout(timer)
            this.refs.listView.beginRefresh()
        }, 500) //自动调用开始刷新 新增方法
        this.setState({
            show: true
        });
        this.getData(orderType, orderStatus);
    }
    getData(orderType, orderStatus) {
        StringBufferUtils.init();
        StringBufferUtils.append('order_type=' + orderType);
        StringBufferUtils.append('&&order_status=' + orderStatus);
        StringBufferUtils.append('&&username=' + Global.userName);
        StringBufferUtils.append('&&type=' + 'android');
        StringBufferUtils.append('&&page=' + pageNum);
        StringBufferUtils.append('&&count=' + 10);
        let params = StringBufferUtils.toString();
        this.fetchData(params);

    }

    //判断是否分页
    isLastPageMethord(flag) {
        if (stringUtil.isNotEmpty(flag) && '1' == flag) {

            isLastPage = true;
        } else {

            isLastPage = false;
        }


    }
    // 数据请求
    fetchData(params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            console.log(responseData);
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                console.log(responseData);
                that.isLastPageMethord(responseData.is_last_page);
                that.addItemKey(responseData.orders);
                pageNum++;
            } else {
                that.setState({
                    show: false
                });

            }
            that.setState({
                show: false
            });
        })
    }
    //点击列表点击每一行
    clickItem(item, index) {


    }

    onClick(item) {

        alert(item.book_id);
    }
    /**
 * 初始化排序
 * 
 */
    initMenu() {
        var topMenu = [];
        for (var i = 0; i < menus.length; i++) {
            var obj = new Object();
            obj.name = menus[i];
            obj.id = i;
            if (i == 0) {

                obj.select = true;
            } else {

                obj.select = false;
            }
            topMenu.push(obj);

        }
        this.setState({

            menuList: topMenu
        })


    }
    _menuClickListener(item, j) {
        var menu_list = this.state.menuList;
        for (var i = 0; i < menu_list.length; i++) {
            menu_list[i].select = false;

        }
        menu_list[j].select = true;
        this.setState({
            menuList: menu_list,

        })
        this.setState({
            show: true
        });
        orderStatus = j == 0 ? '0' : '1';
        this._data = [];
        pageNum = 0;
        this.setState({
            dataListViewSource: this.state.dataListViewSource.cloneWithRows(this._data),
        });
        this.getData(orderType, orderStatus);



    }

    renderMenuseItem(item, i) {
        return <View >
            <TouchableOpacity onPress={() => this._menuClickListener(item, i)}>
                {this._getSelectText(i, item)}
            </TouchableOpacity>

        </View>;
    }

    _getSelectText(i, item) {
        if (i == 0) {
            return <View >
                <View style={{ height: 38, backgroundColor: '#dedede', width: width / 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={i == 0 ? styles.leftSelectBtn : styles.leftUnSelectBtn} >
                            <Text style={item.select == true ? styles.select_txt : styles.unselect_txt} >{item.name}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Image style={{ height: 8, width: width / 3 - 40 }} source={item.select == true ? BOTTOMICON : LABLENOICON} />
                        </View>
                        {this._renderEleLine(item)}
                    </View>
                    <View style={{ width: 2, backgroundColor: '#f3f3f3', height: 38, marginLeft: 1 }}></View>
                </View>
            </View>
        } else {
            return <View >
                <View style={{ height: 38, backgroundColor: '#dedede', width: width / 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={i == 0 ? styles.leftSelectBtn : styles.leftUnSelectBtn} >
                            <Text style={item.select == true ? styles.select_txt : styles.unselect_txt} >{item.name}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Image style={{ height: 8, width: width / 3 - 40 }} source={item.select == true ? BOTTOMICON : LABLENOICON} />
                        </View>
                        {this._renderParperLine(item)}
                    </View>
                </View>
            </View>
        }


    }
    _renderEleLine(item) {
        if (item.type == '0' || item.type == '2') {

            return <View style={{ width: width / 2, backgroundColor: '#1CA831', height: 2 }} />
        } else {
            return <View style={{ width: width / 2, backgroundColor: '#e2e2e2', height: 2 }} />

        }
    }

    _renderParperLine(item) {

        if (item.type == '1' || item.type == '2') {

            return <View style={{ width: width / 2, backgroundColor: '#1CA831', height: 2 }} />
        } else {
            return <View style={{ width: width / 2, backgroundColor: '#e2e2e2', height: 2 }} />

        }
    }
    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        return (
            <View style={{ height: 100, marginTop: 1, backgroundColor: 'white' }} key={index}>
                <TouchableOpacity onPress={() => this.clickItem(itemData, index)} activeOpacity={0.8}>
                    <View style={{ height: 100, marginLeft: 10 }}>
                        <Text style={{ color: '#000000', }}>订单编号:{itemData.order_sn}</Text>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ color: '#000000' }}>订单金额:</Text>
                            <Text style={{ color: '#B6220F' }}>{itemData.order_sum}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#000000' }}>订单状态:</Text>
                            <Text style={{ color: '#B6220F', marginLeft: 5, marginRight: 5 }}>{itemData.order_status == '0' ? '未支付' : '已支付'}</Text>
                            {this.getPayBth(itemData.order_status, itemData)}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#000000' }}>下单时间:</Text>
                            <Text style={{ color: '#000000' }}>{itemData.order_time}</Text>
                        </View>


                    </View>

                </TouchableOpacity>
            </View>
        );
    }

    getPayBth(status, itemData) {

        if (status == '0') {

            return <CustomBtn textColor='white' textSize={14} btnTxt='去支付' _BtnOnlcik={() => this.onClick(itemData)} bgColor='#E89D00' btnWidth={80} btnHeight={30} />
        }
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
                dataListViewSource: that.state.dataListViewSource.cloneWithRows(this._data),
                isLoadMore: isLastPage,
                show: false
            });


        } else {
            that.setState({
                show: false
            });
        }

    }

    /**
     * 下拉刷新
     * @param {*} end 
     */
    _onListRefersh(end) {
        let timer = setTimeout(() => {

            clearTimeout(timer)
            end()//刷新成功后需要调用end结束刷新 不管成功或者失败都应该结束
        }, 500)
    }


    /**
     * 
     * @param {*下拉加载更多} end 
     */
    _onLoadMore(end) {
        this.getData(orderType, orderStatus);
        end(!isLastPage)// 假设加载4页后数据全部加载完毕 加载成功后需要调用end结束刷新  


    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    _keyExtractor = (item, index) => item.key;
    finishOnlcik = () => {

    }
    _dropdown_6_onSelect(idx, value) {
        orderType = idx == 0 ? '0' : '1';
        var txt = idx == 0 ? '电子书订单' : '纸质书订单';
        this.setState({
            title: txt
        })
        this._data = [];
        pageNum = 0;
        this.setState({
            dataListViewSource: this.state.dataListViewSource.cloneWithRows(this._data),
            show: true
        });
        this.getData(orderType, orderStatus);
    }
    renderIosBar() {

        if (Platform.OS === 'ios') {

            return <View style={{ height: 20, backgroundColor: '#E1E7E3', }}></View>
        }

    }
    render() {
        var menuLists = this.state.menuList;
        let dropdown_6_icon = require('../img/order_title_down.png');
        return (

            <View style={styles.main_view}>
                {this.state.show == true ? (<LoadView size={10} color="#FFF" />) : (null)}
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <View>
                {this.renderIosBar()}
                <View style={styles.container}>
                    <View style={styles.left_view} >

                        <TouchableOpacity onPress={() => this.backOnclik()} >
                            <Image style={styles.left_icon} source={BACKICON}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textview}>
                        <Image source={TITLELOG} style={{ height: 32, width: 32 }} />
                        <Text style={styles.textstyle} numberOfLines={1}>{this.state.title}</Text>
                        <ModalDropdown style={styles.dropdown_6}
                            options={DEMO_OPTIONS_1}
                            onSelect={(idx, value) => this._dropdown_6_onSelect(idx, value)}>
                            <Image style={styles.dropdown_6_image}
                                source={dropdown_6_icon}
                            />
                        </ModalDropdown>
                    </View>
                </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#DEDEDE', justifyContent: 'center' }}>


                    {
                        menuLists.map((item, i) => this.renderMenuseItem(item, i))
                    }
                </View>
                <View style={{ height: 1, width: width, backgroundColor: '#1CA831' }} />
                <SwRefreshListView
                    dataSource={this.state.dataListViewSource}
                    ref="listView"
                    renderRow={this._renderSearchItem.bind(this)}
                    onRefresh={this._onListRefersh.bind(this)}//设置下拉刷新的方法 传递参数end函数 当刷新操作结束时 */
                    onLoadMore={this._onLoadMore.bind(this)} //设置上拉加载执行的方法 传递参数end函数 
                    isShowLoadMore={this.state.isLoadMore}
                    //可以通过state控制是否显示上拉加载组件，可用于数据不足一屏或者要求数据全部加载完毕时不显示上拉加载控件


                    customRefreshView={(refresStatus, offsetY) => {
                        return null;
                    }}

                    customRefreshViewHeight={0} //自定义刷新视图时必须指定高度*/

                />
            </View>


        );

    }




}
const styles = StyleSheet.create({

    page: {
        height: height,
        backgroundColor: '#DEDEDE'


    }, textview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    textstyle: {
        fontSize: 18,
        color: '#1FA82D',
        textAlign: 'center',
        paddingLeft: 10,
    }, right_view: {
        flexDirection: 'row',
        alignItems: 'center',


    }, dropdown_6: {
        left: 8,
    }, dropdown_6_image: {
        width: 12,
        height: 9,
    },
    right_icon: {
        width: 39,
        height: 30,
        marginRight: 10,
        justifyContent: 'center'

    }, left_view: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: 30,
    },
    left_icon: {
        width: 39,
        height: 30,
        marginLeft: 10,
        justifyContent: 'center'

    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        alignSelf: 'stretch',
        backgroundColor: '#E1E7E3',
        width: width
    },
    img_item: {
        flex: 1,
        height: 150,
        resizeMode: 'stretch',
        flexDirection: 'column'
    }, page: {
        height: 150,
        backgroundColor: '#f6f6f6'
    }, main_view: {
        flex: 1,
        backgroundColor: '#F0F0F2'


    }, leftSelectBtn: {
        width: width / 2 - 2,
        backgroundColor: '#dedede',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 30,



    }, leftUnSelectBtn: {
        width: width / 2 - 5,
        backgroundColor: '#dedede',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 30,


    }, rightSelectBtn: {
        width: width / 2 - 5,
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'



    }, rightUnSelectBtn: {
        width: width / 2 - 5,
        height: 40,
        backgroundColor: '#F3F3F3',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'


    }, normalselectBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: '#009C18',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRightWidth: 1,
        borderRightColor: '#e2e2e2',
        borderLeftWidth: 1,
        borderLeftColor: '#e2e2e2'



    }
    , normalBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRightWidth: 1,
        borderRightColor: '#e2e2e2',
        borderLeftWidth: 1,
        borderLeftColor: '#e2e2e2'




    }, normaloneBtn: {
        width: (width - 40) / 4,
        padding: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderLeftColor: '#e2e2e2'
    }, select_txt: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        color: '#00B11D',
        width: width / 2,
        textAlign: 'center',

    }, unselect_txt: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        color: '#666666',
        width: width / 2,
        textAlign: 'center',



    }, rule_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 13,
        color: '#000000',
        marginTop: 5
    }, rule_item_time: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 12,
        color: '#999999',
        marginTop: 2
    }, news_item_title: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 15,
        color: '#000000',
        marginTop: 5
    },

});

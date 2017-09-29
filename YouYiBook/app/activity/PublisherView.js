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
    FlatList
} from 'react-native';
import ViewPager from 'react-native-viewpager';
import NetUitl from '../utils/netUitl';
import LoadView from '../view/loading';
import StringBufferUtils from '../utils/StringBufferUtil';
import stringUtil from '../utils/StringUtil';
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/publisher_query';
var pageNum = 0;
var isLastPage = false;
const TITLELOG = require('../img/title_logo.png');
const { width, height } = Dimensions.get('window');
import PublicTitle from '../activity/book_public_title';
const SELECTICON = require('../img/publisher_selected_sign.png');
import {
    SwRefreshListView, //支持下拉刷新和上拉加载的ListView
    // RefreshStatus, //刷新状态 用于自定义下拉刷新视图时使用
    // LoadMoreStatus //上拉加载状态 用于自定义上拉加载视图时使用
} from 'react-native-swRefresh';
import { CachedImage } from "react-native-img-cache";
const BACKICON = require('../img/btn_titel_back.png');
export default class FileterTempActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        header: null,
    });
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            isLoadMore: false,
            publisherList: {},

        }
    }
    componentDidMount() {
        this.getData(true);
    }
    componentWillUnmount() {
        pageNum = 0;
    }

    getData(flag) {
        StringBufferUtils.init();
        StringBufferUtils.append('page=' + pageNum);
        StringBufferUtils.append('&&count=' + 100);
        let params = StringBufferUtils.toString();
        this.fetchData(flag, params);

    }

    //判断是否分页
    isLastPageMethord(flag) {
        if (stringUtil.isNotEmpty(flag) && '1' == flag) {

            isLastPage = true;
        } else {
            this.refs.listView.setNoMoreData()
            isLastPage = false;
        }


    }
    // 数据请求
    fetchData(flags, params) {
        var that = this;
        console.log(BASEURL + params);
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                // that.isLastPageMethord(responseData.is_last_page);
                that.addItemKey(flags, responseData.publishers);
                pageNum++;


            } else {
                that.setState({
                    show: false
                });

            }
        })
    }
    //点击列表点击每一行
    clickItem(item, index) {
        this.changeSelectItem(item.index);
    }
    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        return (
            <TouchableOpacity onPress={() => this.clickItem(itemData, index)} activeOpacity={0.8}>
                <View style={{ alignItems: 'flex-start', backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width - 30 }}>
                        <Text style={styles.news_item_title} numberOfLines={1}>{itemData.item.publisher_name}</Text>
                        {this._renderSelectImg(itemData.item.select)}
                    </View>
                    <View style={{ width: width, height: 1, backgroundColor: '#e2e2e2' }}>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    _renderSelectImg(select) {
        if (select == true) {

            return <Image style={{ height: 16, width: 16 }} source={SELECTICON} />;

        } else {

            return <Image style={{ height: 16, width: 16 }} source={null} />;
        }
    }
    //整合数据
    addItemKey(flag, rulelist) {
        var that = this;
        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据
            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].key = rulelist[i].publisher_id;

            }

            that.defaultSelectItem(flag, rulelist);


        }

    }
    changeSelectItem(index) {
        var lists = this.state.publisherList;
        for (var i = 0; i < lists.length; i++) {

            lists[i].select = false;


        }
        lists[index].select = true;
        this.setState({
            publisherList: lists,
            show: false

        })
        const { navigate, goBack, state } = this.props.navigation;
        state.params.callback(lists[index]);
        goBack();
    }

    defaultSelectItem(flag, tempList) {
        var list = tempList;
        var obj = new Object();
        obj.city = '';
        obj.province = '';
        obj.publisher_id = '0';
        obj.publisher_name = '所有';
        list.unshift(obj);
        for (var i = 0; i < list.length; i++) {

            if (i == 0) {

                list[i].select = true;
            }

        }

        this.setState({
            publisherList: list,
            isLoadMore: isLastPage,
            show: false
        });
        console.log(this.state.publisherList.length);
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    finishOnlcik = () => {

    }
    backOnclik = () => {
        const { goBack } = this.props.navigation;
        goBack();
    }
    _keyExtractor = (item, index) => item.key;
    render() {
        return (

            <View style={styles.page}>

                {this.state.show == true ? (<LoadView size={10} color="#FFF" />) : (null)}
                < StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='筛选' finishIcon={null} leftIcon={BACKICON} />
                <View style={{ height: 1, width: width, backgroundColor: '#00B11D' }} />
                <View style={styles.main_bg}>
                    <FlatList
                        ref={(flatList) => this._flatList = flatList}
                        renderItem={this._renderSearchItem}
                        keyExtractor={this._keyExtractor}
                        data={this.state.publisherList}
                        extraData={this.state}
                    >

                    </FlatList>

                </View>
            </View>

        );

    }




}
const styles = StyleSheet.create({

    news_item_title: {
        justifyContent: 'flex-start',
        padding: 10,
        fontSize: 15,
        color: '#000000',
        marginTop: 5
    }, main_bg: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e2e2e2',
        margin: 10,



    }, page: {
        flex: 1

    }

});

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
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/comment_query';
var pageNum = 0;
var isLastPage = false;
const TITLELOG = require('../img/title_logo.png');
const { width, height } = Dimensions.get('window');
import PublicTitle from '../activity/book_public_title';
const SELECTICON = require('../img/publisher_selected_sign.png');
import { CachedImage } from "react-native-img-cache";
var bookId = '';
const BACKICON = require('../img/btn_titel_back.png');
export default class BookCommentActivity extends Component {
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

        var bookIds = this.props.navigation.state.params.book_id;
        this.getData(bookIds);
    }
    componentWillUnmount() {
        pageNum = 0;
    }

    getData(bookId) {
        StringBufferUtils.init();
        StringBufferUtils.append('book_id=' + bookId);
        StringBufferUtils.append('&&page=' + pageNum);
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
                that.addItemKey(responseData.comments);
                pageNum++;
            } else {
                that.setState({
                    show: false
                });

            }
        })
    }
    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        return (
            <TouchableOpacity onPress={() => this.clickItem(itemData, index)} activeOpacity={0.8}>
                <View style={{ alignItems: 'flex-start', backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width - 30 }}>
                        <Text style={styles.news_item_title} numberOfLines={1}>{itemData.item.name}</Text>
                        <Text style={styles.rule_item_time} numberOfLines={1}>{itemData.item.datetime}</Text>
                    </View>
                    <Text style={styles.content_item_time} numberOfLines={3}>{itemData.item.content}</Text>


                    <View style={{ width: width, height: 1, backgroundColor: '#e2e2e2' }}>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    //整合数据
    addItemKey(rulelist) {
        var that = this;
        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据
            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].key = rulelist[i].comment_id;

            }
            that.setState({

                publisherList: rulelist,
                show: false

            })



        } else {
            that.setState({

                show: false

            })
        }

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
                <PublicTitle _backOnclick={() => this.backOnclik()} _finishOnlcik={() => this.finishOnlcik()} title='评论' finishIcon={null} leftIcon={BACKICON}/>
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
        fontSize: 14,
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

    }, rule_item_time: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 12,
        color: '#999999',
        marginTop: 2
    }, content_item_time: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        fontSize: 14,
        color: '#999999',
        marginTop: 2
    }

});

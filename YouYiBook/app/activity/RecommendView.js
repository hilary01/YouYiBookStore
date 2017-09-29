import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ListView,
    TouchableOpacity,
    Dimensions,
    InteractionManager
} from 'react-native';
import ViewPager from 'react-native-viewpager';
import NetUitl from '../utils/netUitl';
import LoadView from '../view/loading';
import StringBufferUtils from '../utils/StringBufferUtil';
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/init';
var pageNum = 0;
const TITLELOG = require('../img/title_logo.png');
const { width, height } = Dimensions.get('window');
import {
    SwRefreshListView, //支持下拉刷新和上拉加载的ListView
    // RefreshStatus, //刷新状态 用于自定义下拉刷新视图时使用
    // LoadMoreStatus //上拉加载状态 用于自定义上拉加载视图时使用
} from 'react-native-swRefresh';
import { CachedImage } from "react-native-img-cache";
var isLastPage = false;
var navigate = null;
export default class RecomandActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {

            dataSource: new ViewPager.DataSource({
                pageHasChanged: (p1, p2) => p1 !== p2,
            }),
            show: true,
            isLoadMore: false,
            dataListViewSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        }
        this._data = [];
    }

    componentDidMount() {
        navigate = this.props.navigation;
        let timer = setTimeout(() => {
            clearTimeout(timer)
            this.refs.listView.beginRefresh()
        }, 500) //自动调用开始刷新 新增方法

        InteractionManager.runAfterInteractions(() => {
            this.getData();
        });
    }

    getData() {
        // StringBufferUtils.init();
        // StringBufferUtils.append('title=' + keyWord);
        // StringBufferUtils.append('&&pageNo=' + pageNum);
        // StringBufferUtils.append('&&recordsperpage=' + 10);
        // let params = StringBufferUtils.toString();
        this.fetchData('');

    }
    // 数据请求
    fetchData(params) {
        var that = this;
        NetUitl.post(BASEURL, params, '', function (responseData) {
            //下面的就是请求来的数据
            if (null != responseData && responseData.return_code == '0') {
                // that.isLastPageMethord(responseData.is_last_page);
                that.setState({
                    dataSource: that.state.dataSource.cloneWithPages(responseData.ads),
                    show: false,
                });
                that.addItemKey(responseData.recommends);
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
        navigate('BookDetailView', {
            book_id: item.book_id
        });

    }
    // 返回国内法规Item
    _renderSearchItem = (itemData, index) => {
        return (
            <View style={{ height: 100, justifyContent: 'center', marginTop: 1, backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => this.clickItem(itemData, index)} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CachedImage style={{ height: 80, width: 60, marginLeft: 10 }} source={{ uri: itemData.book_icon }} />
                        <View style={{ height: 100, flexDirection: 'column', justifyContent: 'center' }}>
                            <Text style={styles.news_item_title} numberOfLines={2}>{itemData.book_name}</Text>
                            <Text style={styles.rule_item_time}>作者:{itemData.book_author}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Text style={{ color: '#999999', paddingLeft: 20, }}>价格:</Text>
                                <Text style={{ color: '#00B11D' }}>¥{itemData.e_price}</Text>
                                <Text style={{ color: '#999999' }}>(电)</Text>
                                <Text style={{ color: '#00B11D', paddingLeft: 10, }}>¥{itemData.p_price}</Text>
                                <Text style={{ color: '#999999' }}>(纸)</Text>
                            </View>

                            <Text style={styles.rule_item_time} numberOfLines={1}>{itemData.intro}</Text>

                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    //判断是否分页
    isLastPageMethord(flag) {
        if (stringUtil.isNotEmpty(flag) && '1' == flag) {

            isLastPage = true;
        } else {

            isLastPage = false;
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
        this.getData();
        end(isLastPage)// 假设加载4页后数据全部加载完毕 加载成功后需要调用end结束刷新  


    }

    _renderAdvPage(item, pageID) {
        // { uri: item.ad_url }
        var img_url = 'http://img.taopic.com/uploads/allimg/140326/235113-1403260G01561.jpg';
        return (
            <Image
                source={{ uri: img_url }}
                style={styles.img_item} />
        );
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _keyExtractor = (item, index) => item.key;
    render() {
        return (

            <View style={styles.main_view}>
                {this.state.show == true ? (<LoadView size={10} color="#FFF" />) : (null)}
                < View style={styles.page} >
                    <ViewPager
                        style={{ height: 140 }}
                        dataSource={this.state.dataSource}
                        renderPage={this._renderAdvPage}
                        keyExtractor={this._keyExtractor}
                        isLoop={true}
                        autoPlay={true} />
                </View >
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

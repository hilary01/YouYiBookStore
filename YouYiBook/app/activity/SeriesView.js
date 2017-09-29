import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    ScrollView,
    Text,
    Image,
    View,
    StatusBar,
    FlatList,
    TouchableOpacity,
    InteractionManager,
    ListView
} from 'react-native';
import StackNavigator from 'react-navigation';

const { width, height } = Dimensions.get('window');
import Global from '../utils/global';
import NetUitl from '../utils/netUitl';
import LoadView from '../view/loading';
import StringBufferUtils from '../utils/StringBufferUtil';
var pageNum = 0;
var totalPage = 0;
var publisherId = '';
var provinceId = '';
var cityId = '';
const BASEURL = 'http://121.42.238.246:8080/unitrip_bookstore/bookstore/series_query';
import { CachedImage } from "react-native-img-cache";
var navigate = null;
export default class SeriesActivity extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        headerTitle: null,
        headerRight: null,
    });
    // static propTypes = {
    //     _updateUi: React.PropTypes.func.isRequired,
    // };// 注意这里有分号
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            isLoadMore: false,
            dataListViewSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            series: [],

        };
        this._data = [];
    }
    componentDidMount() {
        navigate = this.props.navigation;
        if (undefined != Global.publishId && undefined != Global.provinceId && undefined != Global.cityId) {
            publisherId = Global.publishId;
            provinceId = Global.provinceId;
            cityId = Global.cityId;

        }
        this.getData();
    }

    updateUi(obj) {
        if (undefined != Global.publishId && undefined != Global.provinceId && undefined != Global.cityId) {
            publisherId = Global.publishId;
            provinceId = Global.provinceId;
            cityId = Global.cityId;

        }

        console.log(publisherId, provinceId, cityId);
        this._data = [];
        pageNum = 0;
        totalPage = 0;
        this.getData();
    }

    getData() {
        StringBufferUtils.init();
        StringBufferUtils.append('publisher_id=' + publisherId);
        StringBufferUtils.append('&&province=' + provinceId);
        StringBufferUtils.append('&&city=' + cityId);
        StringBufferUtils.append('&&page=' + pageNum);
        StringBufferUtils.append('&&count=' + 10);
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
                totalPage = 1;
                that.addItemKey(responseData.series);
                pageNum++;
            } else {
                that.setState({
                    show: false
                });

            }
        })
    }
    addItemKey(list) {
        var tempList = [];
        if (null != list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {

                var seriesEntity = list[i];
                seriesEntity.key = i;
                seriesEntity.current_page = 0;
                tempList.push(seriesEntity);

            }

            this.setState({

                series: tempList,
                show: false
            })
        } else {
            this._data = [];
            this.setState({

                series: this._data,
                show: false
            })
        }


    }


    onItemClick(itemData) {
        this._changeMenuData(itemData.index);

    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    _renderTopTitle(m, seriesEntity) {
        var booksView = [];
        var books = seriesEntity.books;
        var current_page = seriesEntity.current_page;
        var that = this;
        for (var i = 0; i < books.length; i++) {
            booksView.push(
                that._renderBook(i, books[i])
            );

        }
        var pagecount = this._getPage(booksView);
        var scrollViewWidth = pagecount * width;
        return <View>

            <Text style={{ padding: 10, color: '#000000', fontSize: 15 }} >{seriesEntity.series_name}</Text>
            {this._separator()}

            <ScrollView horizontal={true} pagingEnabled={true} //滑动完一贞  
                onMomentumScrollEnd={(e) => { this._onAnimationEnd(e, m) }}
                //开始拖拽  
                onScrollBeginDrag={() => { this._onScrollBeginDrag() }}
                //结束拖拽  
                onScrollEndDrag={() => { this._onScrollEndDrag() }}
                ref={'scroll_view_' + i} key={i}>
                <View style={{ flexDirection: 'row', width: scrollViewWidth }}>
                    {booksView}
                </View>
            </ScrollView>
            <View style={{ height: 40, backgroundColor: '#EEEEEE', alignItems: 'center' }}>

                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                    {that._renderAllIndicator(pagecount, current_page)}
                </View>
            </View>
            {this._separator()}

        </View>

    }

    /**开始拖拽 */
    _onScrollBeginDrag() {
        // console.log("开始拖拽");
        //两种清除方式 都是可以的没有区别  
        // this.timer && clearInterval(this.timer);  
    }
    /**停止拖拽 */
    _onScrollEndDrag() {
        // console.log("停止拖拽");
    }
    /**2.手动滑动分页实现 */
    _onAnimationEnd(e, m) {
        //求出偏移量  
        let offsetX = e.nativeEvent.contentOffset.x;
        //求出当前页数  
        let pageIndex = Math.floor(offsetX / width);
        //更改状态机 
        var list = this.state.series;
        list[m].current_page = pageIndex;
        this.setState({

            series: list
        })
    }

    _getPage(booksView) {
        var pageSize = 1;

        if (booksView.length % 4 == 0) {

            pageSize = booksView.length / 4;
        } else {

            pageSize = parseInt(booksView.length / 4) + 1;
        }
        return pageSize;


    }
    //点击列表点击每一行
    clickItem(item, index) {
        navigate('BookDetailView', {
            book_id: item.book_id
        });

    }
    _renderBook(i, bookEntity) {
        return <TouchableOpacity activeOpacity={0.8} onPress={() => this.clickItem(bookEntity, i)} >
            <View key={i} style={{ height: 120, alignItems: 'center', margin: 2, width: (width - 20) / 4 }}>
                <CachedImage style={{ height: 100, width: (width - 40) / 4 }} source={{ uri: bookEntity.book_icon }} />
                <Text style={{ padding: 2, width: (width - 20) / 4, textAlign: 'center' }} numberOfLines={1}>{bookEntity.book_name}</Text>

            </View>
        </TouchableOpacity>


    }
    /**3.页面指针实现 */
    _renderAllIndicator(imgsArr, currentPage) {
        let indicatorArr = [];
        let style;
        for (let i = 0; i < imgsArr; i++) {
            //判断  
            style = (i == currentPage) ? { color: '#00B11D' } : { color: 'white' };
            indicatorArr.push(
                <Text key={i} style={[{ fontSize: 30 }, style]}>
                    •
        </Text>
            );
        }
        return indicatorArr;
    }
    render() {
        var that = this;
        var serieNames = [];
        var series = this.state.series;
        for (var i = 0; i < series.length; i++) {
            serieNames.push(
                that._renderTopTitle(i, series[i])
            );
        }
        return (
            <View style={styles.menu}>
                {this.state.show == true ? (<LoadView size={10} color="#FFF" />) : (null)}
                {/* <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                /> */}

                <ScrollView>
                    <View>
                        {serieNames}
                    </View>
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        width: window.width,
        height: window.height,
        backgroundColor:'#dedede'
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        flex: 1,
    },
    name: {
        position: 'absolute',
        left: 70,
        top: 20,
    },
    item_select: {
        fontSize: 16,
        padding: 10,
        color: 'white',



    },
    item_unselect: {
        fontSize: 16,
        padding: 10,
        color: 'black',



    },
    item_view: {
        width: width,
        height: 50,

    }
});

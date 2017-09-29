import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    FlatList,
    ListView,
    TextInput,
    InteractionManager
} from 'react-native';

var {height, width} = Dimensions.get('window');
import {CachedImage} from "react-native-img-cache";
import LoadView from '../view/loading';
import Global from '../utils/global';
import DeviceStorage from '../utils/deviceStorage';

var navigate = null;
export default class GoodsCartActivity extends Component {
    static propTypes = {
        addgoodscart: React.PropTypes.func.isRequired,
    };// 注意这里有分号
    constructor(props) {
        super(props);
        this.state = {
            totalMoney: '0.00',
            totalCount: 0,
            show: false,
            showNoData: true,
            goodsList: {},
            tempList: {}
        };

    }

    componentDidMount() {
        navigate = this.props.navigation;
        var that = this;


        DeviceStorage.get('book_goodscart_key', function (jsonValue) {
            if (null != jsonValue) {
                console.log(jsonValue);
                that.setState({
                    show: true
                });

                that.addItemKey(jsonValue);
            } else {
                that.setState({
                    show: false,
                    showNoData: false,
                });
            }

        });


    }

    //点击列表点击每一行
    clickItem(itemData, index) {
        navigate('BookDetailView', {
            book_id: itemData.item.book_id
        });

    }

    _addGoods(itemData) {
        var list = this.state.goodsList;
        var index = itemData.index;
        var goods_count = itemData.item.count;
        list[index].count = goods_count + 1;
        this.setState({

            goodsList: list

        })
        this._totalMoney(list);
    }

    _reduceGoods(itemData) {
        var list = this.state.goodsList;
        var index = itemData.index;
        var goods_count = itemData.item.count;
        if (goods_count - 1 > 0) {
            list[index].count = goods_count - 1;
            this.setState({

                goodsList: list

            })
        }
        this._totalMoney(list);

    }

    _totalMoney(list) {
        var money = 0.00;
        var googsCounts = 0;
        if (null != list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {

                if (list[i].select == true) {
                    money = money + parseFloat(list[i].p_price) * list[i].count;
                    googsCounts = +googsCounts + list[i].count;

                }

            }

        } else {

            this.setState({

                totalMoney: '0.00',
                totalCount: 0
            })
        }
        var temp = money.toFixed(2) + '';
        var nodata = list.length == 0 ? false : true;
        this.setState({

            totalMoney: temp,
            totalCount: googsCounts,
            showNoData: nodata
        })

        return money.toFixed(2);
    }

    /**
     * 删除版权
     * @param {*} id
     */
    deleteMethord() {
        var list = this.state.goodsList;
        var tempList = [];
        for (var i = 0; i < list.length; i++) {

            if (list[i].select == false) {

                tempList.push(list[i]);
            }

        }

        this.setState({
            goodsList: tempList,
            show: false
        });
        DeviceStorage.save('book_goodscart_key', tempList);
        this._totalMoney(tempList);
    }

    _deleteBook() {
        var list = this.state.goodsList;
        var that = this;
        if (this.getIsSelect()) {

            if (null != list && list.length > 0) {
                that.setState({
                    show: true

                })
                for (var i = 0; i < list.length; i++) {

                    if (list[i].select == true) {

                        that.deleteSynMethord(list[i]);

                    }

                }

                that.deleteMethord();
            }
        }


    }


    getIsSelect() {

        var list = this.state.goodsList;
        var isSelect = false;
        if (null != list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {

                if (list[i].select == true) {

                    isSelect = true

                }

            }

        }
        return isSelect;
    }


    deleteSynMethord(itemData) {
        var that = this;
        InteractionManager.runAfterInteractions(() => {
            // ...耗时较长的同步的任务...
            DeviceStorage.delete('goodscart_' + itemData.book_id, function (result) {

                if (result == '0') {

                } else {

                    toastShort('删除失败！');
                }
            });
        });


    }


    _renderItem = (itemData, index) => {
        return (
            <View style={{height: 140, justifyContent: 'center', marginTop: 1, backgroundColor: 'white'}}>
                <TouchableOpacity onPress={() => this.clickItem(itemData, index)} activeOpacity={0.8}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {this._renderselectImg(itemData)}
                        <CachedImage style={{height: 100, width: 80, marginLeft: 5}}
                                     source={{uri: itemData.item.book_icon}}/>
                        <View style={{height: 130, flexDirection: 'column', justifyContent: 'center', marginLeft: 10}}>
                            <Text style={styles.news_item_title} numberOfLines={1}>{itemData.item.book_name}</Text>
                            <Text style={styles.rule_item_time}>作者:{itemData.item.book_author}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text>价格：</Text>
                                <Text style={{color: '#DF4A0C'}}>
                                    ¥{itemData.item.p_price}
                                </Text>

                            </View>
                            <Text style={styles.rule_item_time}
                                  numberOfLines={1}>出版社:{itemData.item.publisher_name}</Text>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 5
                            }}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this._reduceGoods(itemData)}>
                                    <Image style={{height: 34, width: 39,}}
                                           source={require('../img/btn_decrease.png')}/>
                                </TouchableOpacity>
                                <View style={{
                                    padding: 5,
                                    width: 60,
                                    borderWidth: 1,
                                    borderColor: '#e2e2e2',
                                    backgroundColor: 'white',
                                    alignItems: 'center',
                                    marginLeft: 5,
                                    marginRight: 5
                                }}>
                                    <Text>{itemData.item.count}</Text>
                                </View>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this._addGoods(itemData)}>
                                    <Image style={{height: 34, width: 39,}} source={require('../img/btn_plus.png')}/>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _renderselectImg(itemData) {
        if (itemData.item.select == true) {
            return <TouchableOpacity activeOpacity={0.8} onPress={() => this._changeItemState(itemData)}>
                <View style={{height: 34, width: 34, marginLeft: 10, alignItems: 'center'}}>
                    <Image style={{height: 17, width: 17,}} source={require('../img/btn_checkbox_cheked.png')}/>
                </View>
            </TouchableOpacity>

        } else {
            return <TouchableOpacity activeOpacity={0.8} onPress={() => this._changeItemState(itemData)}>
                <View style={{height: 34, width: 34, marginLeft: 10, alignItems: 'center'}}>
                    <Image style={{height: 17, width: 17,}} source={require('../img/btn_checkbox_unchecked.png')}/>
                </View>
            </TouchableOpacity>

        }


    }

    _changeItemState(itemData) {
        var flag = itemData.item.select == true ? false : true;
        var list = this.state.goodsList;
        var index = itemData.index;
        list[index].select = flag;
        this.setState({

            goodsList: list

        })

        this._totalMoney(list);

    }

    _keyExtractor = (item, index) => item.key;

    /**
     * 空数据时显示
     */
    _renderData() {

        if (this.state.showNoData == true) {
            return <View>

                <FlatList
                    ref={(flatList) => this._flatList = flatList}
                    renderItem={this._renderItem.bind(this)}
                    keyExtractor={this._keyExtractor}
                    data={this.state.goodsList}
                    extraData={this.state}
                >

                </FlatList>
            </View>

        } else {

            return <View style={{alignItems: 'center'}}>
                <Image source={require('../img/shoppingcar_nodata_logo.png')}
                       style={{height: 150, width: 150, marginTop: 20}}/>
                <Text style={{marginTop: 20}}>购物车是空的，快去选购心爱的商品去吧！</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => this._goBook()}>
                    <Image source={require('../img/btn_shoppingcar_nodata.png')}
                           style={{height: 40, width: 191, marginTop: 20}}/>

                </TouchableOpacity>

            </View>
        }


    }

    //整合数据
    addItemKey(rulelist) {
        var that = this;
        if (null != rulelist && rulelist.length > 0) {

            //整合法规数据

            for (var i = 0; i < rulelist.length; i++) {
                rulelist[i].select = false;
                rulelist[i].key = rulelist[i].book_id;
                rulelist[i].count = 1;
            }
            that.setState({
                showNoData: true,
                goodsList: rulelist,
                show: false
            });


        } else {
            that.setState({
                show: false,
                showNoData: false,
            });
        }


    }

    _goBook() {

        this.props.addgoodscart();
    }

    _showImg(flag) {

        this.props.showImgIcon(flag);
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.show == true ? (<LoadView/>) : (null)}
                <View style={{flexDirection: 'row', width: width, height: 45,}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                        <Text>预估金额
                            (<Text style={{color: '#DF4A0C'}}>
                                ¥{this.state.totalMoney}
                            </Text>)

                        </Text>

                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                        <Text>商品数量
                            (<Text>
                                {this.state.totalCount}
                            </Text>)

                        </Text>

                    </View>

                </View>
                <View style={{height: 1, width: width, backgroundColor: '#e2e2e2'}}/>

                {this._renderData()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f3f3',
        flex: 1
    },
});
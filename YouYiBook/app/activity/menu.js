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
    InteractionManager
} from 'react-native';
import StackNavigator from 'react-navigation';

const { width, height } = Dimensions.get('window');
import Global from '../utils/global';
import MainScreen from '../main';
const topBg = require('../img/menu_head.png');
const appBg = require('../img/menu_bg.png');
var menuName = ['书城', '书架', '购物车', '个人中心', '游逸天下系列', '更多'];
var select_img01 = require('../img/app_menu_bookstore_icons.png');
var select_img02 = require('../img/app_menu_bookshelf_icons.png');
var select_img03 = require('../img/app_menu_cart_icons.png');
var select_img04 = require('../img/app_menu_user_icons.png');
var select_img05 = require('../img/app_menu_apprecommend_icons.png');
var select_img06 = require('../img/app_menu_more_icons.png');
var menuSelectIcon = [select_img01, select_img02, select_img03, select_img04
    , select_img05, select_img06];
var unselect_img01 = require('../img/app_menu_bookstore_icon.png');
var unselect_img02 = require('../img/app_menu_bookshelf_icon.png');
var unselect_img03 = require('../img/app_menu_cart_icon.png');
var unselect_img04 = require('../img/app_menu_user_icon.png');
var unselect_img05 = require('../img/app_menu_apprecommend_icon.png');
var unselect_img06 = require('../img/app_menu_more_icon.png');
var menuUnSelectIcon = [unselect_img01, unselect_img02, unselect_img03, unselect_img04
    , unselect_img05, unselect_img06];
const selectBg = require('../img/menu_item_selected_bg.png');
const split_line = require('../img/split_line.png');
export default class Menu extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // 这里面的属性和App.js的navigationOptions是一样的。
        headerTitle: null,
        headerRight: null,
    });
    static propTypes = {
        onItemSelected: React.PropTypes.func.isRequired,
    };// 注意这里有分号

    constructor(props) {
        super(props);
        this.state = {
            menuData: {},
            menuEntity: null,
            selectIndex: 0
        };
        // this.onItemClick = this.onItemClick.bind(this);
    }
    componentDidMount() {

        this._initMenuData(0);

    }
    _initMenuData(selectIndex) {
        var menuList = new Array();
        for (var i = 0; i < menuName.length; i++) {
            var menu = new Object();
            menu.id = i;
            menu.name = menuName[i];
            menu.select_icon = menuSelectIcon[i];
            menu.unselect_icon = menuUnSelectIcon[i];
            menu.key = i;
            if (i == selectIndex) {
                menu.select = true;

            } else {

                menu.select = false;
            }
            menuList.push(menu);

        }
        this.setState({

            menuData: menuList,

        });

        Global.menuEntity = menuList[selectIndex];

    }
    _changeMenuData(selectIndexs) {
        var menuList = this.state.menuData;
        if (this.props.onItemSelected(menuList[selectIndexs]));
        this.setState({

            selectIndex: selectIndexs
        });

    }
    _renderItem(itemData) {
        if (this.state.selectIndex == itemData.index) {
            return (<TouchableOpacity onPress={() => this.onItemClick(itemData)} >
                <View>
                    <Image style={{ height: 40, width: width }} source={selectBg}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' ,width:width}}>

                            <Image source={itemData.item.select_icon} style={{ height: 26, width: 26, marginLeft: 10 }} />
                            <Text
                                style={styles.item_select}>
                                {itemData.item.name}
                            </Text>

                        </View>

                    </Image>
                    <Image style={{ height: 1, width: width }} source={split_line} />


                </View>
            </TouchableOpacity>)
        } else {
            return (<TouchableOpacity onPress={() => this.onItemClick(itemData)} >
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center',width:width }}>

                        <Image source={itemData.item.unselect_icon} style={{ height: 26, width: 26, marginLeft: 10 }} />
                        <Text
                            style={styles.item_unselect}>
                            {itemData.item.name}
                        </Text>
                    </View>
                    <Image style={{ height: 1, width: width }} source={split_line} />
                </View>
            </TouchableOpacity>)

        }

    }

    onItemClick(itemData) {
        this._changeMenuData(itemData.index);

    }
    updateItemIndex() {

        this._changeMenuData(0);
    }
    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#e2e2e2' }} />;
    }
    render() {
        return (
            <View style={styles.menu}>
                <StatusBar
                    animated={true}
                    hidden={false}
                    backgroundColor={'#F3F3F3'}
                    barStyle={'default'}
                    networkActivityIndicatorVisible={true}
                />
                <Image style={{ width: width, height: height, }} source={appBg}>

                    <View>

                        <View >
                            <Image style={{ height: 45, width: width }}
                                source={topBg} />
                        </View>

                        <FlatList
                            style={{ height: height }}
                            ref={(flatList) => this.menu_listview = flatList}
                            ItemSeparatorComponent={this._separator}
                            renderItem={this._renderItem.bind(this)}
                            data={this.state.menuData}>
                        </FlatList>
                    </View>


                </Image>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        width: window.width,
        height: window.height,
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
        backgroundColor: 'transparent'



    },
    item_unselect: {
        fontSize: 16,
        padding: 10,
        color: 'black',
        backgroundColor: 'transparent'



    },
    item_view: {
        width: width,
        height: 50,

    }
});

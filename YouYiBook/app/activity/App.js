/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {
    StackNavigator,
    TabNavigator,
} from 'react-navigation';

import React from 'react';

import CardStackStyleInterpolator from 'react-navigation/src/views/CardStackStyleInterpolator';


import {
    Image,
    StyleSheet,
    Text,
    AsyncStorage
} from 'react-native';
import sidemenu from './sidemenu';
import detail from '../main';
import filterActivity from '../activity/FilterView';
import PublisherActivity from '../activity/PublisherView';
import SearchActivity from '../activity/SearchView';
import SearchResultActivity from '../activity/SearchResultView';
import BookDetailActivity from '../activity/BookDetailView';
import BookCommentActivity from '../activity/BookCommentView';
import LoginActivity from '../activity/LoginView';
import RegistActivity from '../activity/RegistView';
import CenterLoginActivity from '../activity/CenterLoginView';
import BookShelfActivity from '../activity/BookShelfView';
import PdfReadActivity from '../activity/PdfReaderView';
import SendCommentActivity from '../activity/CommentView';
import PersonViewActivity from '../activity/PersonView';
import FindPassActivity from '../activity/FindPassView';
import MoreActivity from '../activity/MoreView';
import RecommendAppActivity from '../activity/RecommendAppView';
import OrderActivity from '../activity/OrderView';
import consumeActivity from '../activity/ConsumeRecoderView';
import FavoriteActivity from '../activity/BookFavoriteView';
import ClassListActivity from '../activity/ClassifyListView';
import AddressActivity from '../activity/BookAddressView';
import EditAddressActivity from '../activity/EditAddressView';
import UserInfoActivity from '../activity/UserInfoView';
import MessageActivity from '../activity/MessageView';
import CountCenterActivity from '../activity/CountCenterView';
import AboutActivity from '../activity/AboutView';
/**
 * 1、Test1是通过普通的属性创建的Tabbar和导航
 * 2、Test2是在页面中通过属性创建Tabbar和导航
 * 3、Test3是通过封装navigationOptions实现Tabbar和导航的
 */




const TransitionConfiguration = () => ({
    screenInterpolator: (sceneProps) => {
        const { scene } = sceneProps;
        const { route } = scene;
        const params = route.params || {};
        const transition = params.transition || 'forHorizontal';
        return CardStackStyleInterpolator[transition](sceneProps);
    },
});

// 初始化StackNavigator
const MyNav = StackNavigator({
    main: {
        screen: sidemenu,

    },
    // 将需要跳转的页面注册在这里，全局才可以跳转
    detail: {
        screen: detail
    },
    filterView: {

        screen: filterActivity
    },
    publisherView: {

        screen: PublisherActivity
    },
    searchView: {

        screen: SearchActivity
    },
    searchResultView: {

        screen: SearchResultActivity
    },
    BookDetailView: {

        screen: BookDetailActivity
    },
    BookCommentView: {

        screen: BookCommentActivity
    },
    LoginView: {

        screen: LoginActivity
    },
    RegistView: {

        screen: RegistActivity
    },
    CenterLoginView: {

        screen: CenterLoginActivity
    },
    BookShelfView: {

        screen: BookShelfActivity
    },
    PdfReadView: {

        screen: PdfReadActivity
    },
    CommentView: {

        screen: SendCommentActivity
    },
    PersonView: {

        screen: PersonViewActivity
    },
    FindPassView: {

        screen: FindPassActivity
    },
    MoreView: {

        screen: MoreActivity
    },
    RecommendAppView: {

        screen: RecommendAppActivity
    },
    OrderView: {

        screen: OrderActivity
    },
    ConsumeView: {

        screen: consumeActivity
    },
    FavoriteView: {

        screen: FavoriteActivity
    },
    ClassListView: {
        screen: ClassListActivity
    },
    AddressView: {
        screen: AddressActivity
    },
    EditAddressView: {
        screen: EditAddressActivity
    },
    UserInfoView: {
        screen: UserInfoActivity
    },
    MessageView: {
        screen: MessageActivity
    },
    CountCenterView: {
        screen: CountCenterActivity
    },
    AboutView: {
        screen: AboutActivity
    }



}, {
        transitionConfig: TransitionConfiguration,
    }, {
        initialRouteName: 'main'
    });

const TabOptions = (tabBarTitle, normalImage, selectedImage, navTitle) => {
    // console.log(navigation);
    const tabBarLabel = tabBarTitle;
    const tabBarIcon = (({ tintColor, focused }) => {
        return (
            <Image
                source={!focused ? normalImage : selectedImage}
                style={[{ height: 35, width: 35 }, { tintColor: tintColor }]}
            />
        )
    });
    const headerTitle = navTitle;
    const headerTitleStyle = { fontSize: 22, color: 'white', alignSelf: 'center' };
    // header的style
    const headerStyle = { backgroundColor: '#4ECBFC' };
    const tabBarVisible = true;
    // const header = null;
    return { tabBarLabel, tabBarIcon, headerTitle, headerTitleStyle, headerStyle, tabBarVisible };
};

export default MyNav;
// @flow

import {create} from 'mobx-persist';
import {AsyncStorage} from 'react-native';

import App     from './App';
import User    from './User';

const hydrate = create({storage: AsyncStorage});

const stores = {
    App,
    User
};

// you can hydrate stores here with mobx-persist
hydrate('User', stores.User);

export default {
    ...stores
};

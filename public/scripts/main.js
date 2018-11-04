'use strict';

import Landing from './views/LandingView/Landing.mjs';
import Menu from './views/MenuView/Menu.mjs';
import RulesView from './views/RulesView/RulesView.mjs';
import Profile from './views/ProfileView/Profile.mjs';
import SignIn from './views/SignInView/SignIn.mjs';
import SignUp from './views/SignUpView/SignUp.mjs';
import Leaders from './views/LeadersView/Leaders.mjs';
import Router from './modules/Router.mjs';

const router = new Router();

router.addPath('/', Landing);
router.addPath('/signin', SignIn, router);
router.addPath('/signup', SignUp, router);
router.addPath('/rules', RulesView,{type: 'back'});
router.addPath('/menu', Menu);
router.addPath('/leaders', Leaders);
router.addPath('/profile', Profile, {profile: '', router: router});
router.start();
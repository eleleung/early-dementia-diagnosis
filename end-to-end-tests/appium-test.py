
import os
import unittest
import time
from appium import webdriver

class MobileAppTestAppium(unittest.TestCase):

    def setUp(self):
        desired_caps = {}
        desired_caps['platformName'] = 'iOS'
        desired_caps['platformVersion'] = '11.0'
        desired_caps['deviceName'] = 'iPhone 5s'
        desired_caps['app'] = './dementia-detect-react-app/ios/build/Build/Products/Debug-iphonesimulator/ReactNativeNavigationMobxBoilerplate.app'
        desired_caps['automationName'] = 'XCUITest'

        self.driver = webdriver.Remote('http://127.0.0.1:4723/wd/hub', desired_caps)

    def test_login(self):
        loginbutton = self.driver.find_element_by_name("Log in")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password");
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com']);
        passwordField.send_keys(['password']);
        loginbutton.click();

        time.sleep(2);

        #assert that the login was successful
        #check that the home buttons are displayed and the login button is no longer there
        homebutton = self.driver.find_element_by_name("Home")
        informationbutton = self.driver.find_element_by_name("Information")
        testsbutton = self.driver.find_element_by_name("Tests")
        settingsbutton = self.driver.find_element_by_name("Settings")
        self.assertTrue(homebutton.is_displayed())
        self.assertTrue(informationbutton.is_displayed())
        self.assertTrue(testsbutton.is_displayed())
        self.assertTrue(settingsbutton.is_displayed())
        self.assertFalse(loginbutton.is_displayed())

    def test_login_invalidemail(self):
        loginbutton = self.driver.find_element_by_name("Log in")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password");
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['invalid@email.com']);
        passwordField.send_keys(['password']);
        loginbutton.click();

        time.sleep(2);

        # assert that the login was unsuccessful
        # check that we're still on the login page and the login button is still displayed
        self.assertTrue(loginbutton.is_displayed())

    def test_login_invalidpassword(self):
        loginbutton = self.driver.find_element_by_name("Log in")
        emailField = self.driver.find_element_by_name("email")
        passwordField = self.driver.find_element_by_name("password");
        self.assertTrue(loginbutton.is_displayed())
        self.assertTrue(emailField.is_displayed())
        self.assertTrue(passwordField.is_displayed())

        emailField.send_keys(['email@email.com']);
        passwordField.send_keys(['invalid']);
        loginbutton.click();

        time.sleep(2);

        # assert that the login was unsuccessful
        # check that we're still on the login page and the login button is still displayed
        self.assertTrue(loginbutton.is_displayed())

    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(MobileAppTestAppium)
    unittest.TextTestRunner(verbosity=2).run(suite)
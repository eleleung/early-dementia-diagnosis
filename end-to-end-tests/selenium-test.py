# -*- coding: utf-8 -*-
from bson import ObjectId
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
from pymongo import MongoClient
from bson.objectid import ObjectId

class WebAppTest(unittest.TestCase):
    
    #packages: geckodriver v0.19.0, selenium version 3.6.0, firefox v 56

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:4200/"
        self.verificationErrors = []
        self.accept_next_alert = True

        #connect to mongoDB
        self.client = MongoClient("mongodb://test:test@ds013956.mlab.com:13956/alz_backend_test")
        self.db = self.client['alz_backend_test']
        result = self.db.doctors.delete_many({})
        result = self.db.users.delete_many({})
        result = self.db.patients.delete_many({})
        print(result)

    #login tests
    def test_FRD03A_valid_login_should_login_correctly(self):

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"):break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        #enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        #enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        #click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        #assert that we have hit the overview page
        self.assertTrue(driver.find_element_by_xpath("//h1[contains(.,'Overview')]"));

    def test_FRD03B_invalid_login_doctor_does_not_exist_should_error(self):
        driver = self.driver
        driver.get("http://localhost:4200")
        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("invlid@email")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("invalid")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        for i in range(10):
            try:
                if driver.find_element_by_xpath(
                    "//p[contains(.,'Error with login credentials, please check your email and password')]"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")
        self.assertTrue(driver.find_element_by_xpath("//p[contains(.,'Error with login credentials, please check your email and password')]"))

    def test_FRD03B_invalid_login_no_password_entered_should_error(self):

            self.helper_add_doctor()

            driver = self.driver
            driver.get(self.base_url)
            driver.find_element_by_id("email").clear()
            driver.find_element_by_id("email").send_keys("invalid@email")
            driver.find_element_by_xpath("//button[@type='submit']").click()
            for i in range(60):
                try:
                    if driver.find_element_by_xpath(
                        "//p[contains(.,'Error with login credentials, please check your email and password')]"): break
                except:
                    pass
                time.sleep(1)
            else:
                self.fail("time out")
            self.assertTrue(driver.find_element_by_xpath(
                    "//p[contains(.,'Error with login credentials, please check your email and password')]"))

    def test_FRD03B_invalid_login_no_email_entered_should_error(self):

            self.helper_add_doctor()

            driver = self.driver
            driver.get(self.base_url)
            driver.find_element_by_id("email").clear()
            driver.find_element_by_id("password").clear()
            driver.find_element_by_id("password").send_keys("password")
            driver.find_element_by_xpath("//button[@type='submit']").click()
            for i in range(10):
                try:
                    if driver.find_element_by_xpath(
                        "//p[contains(.,'Error with login credentials, please check your email and password')]"): break
                except:
                    pass
                time.sleep(1)
            else:
                self.fail("time out")
            self.assertTrue(driver.find_element_by_xpath(
                    "//p[contains(.,'Error with login credentials, please check your email and password')]"))

    # test view patients
    def test_FRD07_view_doctor_patient_list(self):

        self.addDoctorWithPatient()

        self.helper_add_doctor()

        driver = self.driver
        driver.get(self.base_url)

        for i in range(10):
            try:
                if driver.find_element_by_xpath("//div[@class='login']"):break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        driver.find_element_by_id("email").clear()
        driver.find_element_by_id("email").send_keys("doctor@email.com")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("password")
        driver.find_element_by_xpath("//button[@type='submit']").click()
        # ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]

        #enter email
        self.assertEqual("doctor@email.com", driver.find_element_by_id("email").get_attribute("value"))
        for i in range(10):
            try:
                if "doctor@email.com" == driver.find_element_by_id("email").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        #enter password
        self.assertEqual("password", driver.find_element_by_id("password").get_attribute("value"))
        for i in range(60):
            try:
                if "password" == driver.find_element_by_id("password").get_attribute("value"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")

        #click submit
        driver.find_element_by_xpath("//button[@type='submit']").click()

        time.sleep(2)

        driver.find_element_by_xpath("//span[contains(.,'Patients')]").click();

        time.sleep(0.2)

        #assert that first patient is visible
        self.assertTrue(driver.find_element_by_xpath("//h1[contains(.,'First')]"));

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e:
            return False
        return True

    def is_alert_present(self):
        try:
            self.driver.switch_to_alert()
        except NoAlertPresentException as e:
            return False
        return True

    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally:
            self.accept_next_alert = True

    def helper_add_doctor(self):
        result = self.db.users.insert({
            "firstName": "doctorFirstName",
            "lastName": "doctorLastName",
            "email": "doctor@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        })

        print(result)

        self.db.doctors.insert({
            "user": ObjectId(result),
            "referenceCode": "correctRefCode"
        })

    def helper_add_patient(self):

        self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        });

    def helper_add_secondPatient(self):
        self.db.patients.insert({
            "firstName": "Second",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        });

    def addDoctorWithPatient(self):

        carer = self.db.users.insert({
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": []
        });

        self.userId = carer

        patientId = self.db.patients.insert({
            "firstName": "First",
            "lastName": "Patient",
            "gender": "Female",
            "dateOfBirth": "1980-12-30T16:00:00.000Z",
            "carers": [ObjectId(self.userId)],
        });

        result = self.db.users.insert({
            "firstName": "doctorFirstName",
            "lastName": "doctorLastName",
            "email": "doctor@email.com",
            "password": "$2a$10$9Xy0cMwnn0.y/bn/SWoAGOzSGPJuzoTgsJzcHMAYsO2A3U3BLg0Iy",
            "tests": [],
            "patients": [ObjectId(patientId)]
        })


        print(result)

        doctorresult = self.db.doctors.insert({
            "user": ObjectId(result),
            "referenceCode": "correctRefCode"
        })

        #update patient with doctor
        self.db.patients.update({'_id': ObjectId(patientId)},
                             {'$set': {'doctors': [ObjectId(doctorresult)]}})

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()

# -*- coding: utf-8 -*-
"""
Author: Zoheb0707

Created: 06/19/2019
"""

import mysql.connector as RDB

'''Query execution error function'''
def query_execution_error():
    raise Exception('Error executing query')

'''declaring Database Connection'''
try:
    DB = RDB.connect(
      host="localhost",
      user="root",
      passwd="root",
      database="maps"
    )
except RDB.Error:
    raise Exception('Error connectiong to database')
    
'''Creating Query Executer'''
Query_Executer = DB.cursor()


'''Test query 1, fetch from visits table'''
try:
    Query_Executer.execute("SELECT *  FROM visits;")
    myresult = Query_Executer.fetchall()
    print(myresult)
except RDB.Error:
    query_execution_error()

'''Test query 2, add to users table'''
try:
    query = "INSERT INTO users VALUES(%s, %s, %s, %s);"
    inputs = ('test_id', 'test_passwd', 'test_fn', 'test_ln')
    Query_Executer.execute(query, inputs) #values should be entered separately to protect against SQL injection
    DB.commit() #this is required when updating database
except RDB.Error:
    query_execution_error()

'''Test query 3, fetch from users table'''
try:
    Query_Executer.execute("SELECT *  FROM users;")
    myresult = Query_Executer.fetchall()
    print(myresult)
except RDB.Error:
    query_execution_error()
# Changes

This file is a manually maintained list of changes for each release.

## v2.3.5
* fix bug of syntax '{{xxx}}'

* fix bug of no default value of update method

## v2.3.2

* fix bug of no default value of update method

## v2.3.1

* fix bug of toLowerCase

## v2.3.0

* Only support node > v7.6.0. If you use node(< v7.6.0), you can use nodebatis(<= v2.2.1)(NOT RECOMMENDED).
* When camelCase is true, Converts snakeCase to camelCase of data from db and Converts camelCase to snakeCase of insert and update method.
* In the case `... where and ...`, remove the keyword `and` automatically.


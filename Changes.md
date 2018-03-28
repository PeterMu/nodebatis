# Changes

This file is a manually maintained list of changes for each release.

## v2.3.0 (current)

* Only support node > v7.6.0. If you use node(< v7.6.0), you can use nodebatis(<= v2.2.1)(NOT RECOMMENDED).
* When camelCase is true, Converts snakeCase to camelCase of data from db and Converts camelCase to snakeCase of insert and update method.
* In the case `... where and ...`, remove the keyword `and` automatically.


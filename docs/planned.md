# Planned Features

* ~~Array access syntax (`ARRAY[INDEX]`)~~
* ~~Array/struct access in assignment (`ARRAY[INDEX]=VALUE`,`STRUCT.FIELD=VALUE`)~~
* ~~User defined functions~~
* User defined Constants
* Some nice FOR loop variants (`FOR [ index , ] value IN list` or maybe just `FOR index IN list`)
* ~~Remove { } array syntax. `:(`~~
* Structs/user defined types/tables/whatever you want to call them. Will use `@` type suffix, and literals are written as **{** *key* [ **=** *value* ] [ , ... ] **}**. `{X=1,Z=3} + {X=2,Y=1} -> {X=2,Y=1,Z=3}`
* A variable type that can store a value of any type (type suffix `?`).
* ~~Variable declarations~~
* ~~Way of giving variables types without using suffixes.~~

## Maybe

* ~~Better syntax for subroutine functions (`ARRAY#.PUSH VALUE`)?~~
* ~~Maybe just make everything an expression...~~
* Maybe support WHILE...ELSE and FOR...ELSE, where the ELSE code runs if the loop doesn't run (but what END keyword would be used?)
* Don't use `.` for 2 separate things
* Add shortcutting to AND/OR
* Some way to pass a list of parameters as an array (like Javascript's `function(...args)`)
* Decide whether functions like `sort` should modify the array or return the sorted version.

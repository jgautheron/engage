#!/bin/sh
# usage: run.sh gen|mod <dir>   → prints "pass/total"
cd "$(dirname "$0")/tests"
out=$(TARGET="$2" KIND="$1" bun test ./suite.test.ts 2>&1)
p=$(echo "$out" | grep -Eo '^ *[0-9]+ pass' | grep -Eo '[0-9]+'); f=$(echo "$out" | grep -Eo '^ *[0-9]+ fail' | grep -Eo '[0-9]+')
echo "${p:-0}/$(( ${p:-0} + ${f:-0} ))"
[ "$3" = "-v" ] && echo "$out" | grep -E '^\(fail\)'
exit 0

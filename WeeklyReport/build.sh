#!/bin/sh
#rm -rf ./dist/ && mkdir ./dist
#cp -R ./bin/ ./dist/bin/ && cp -R ./public/ ./dist/public/ && cp -R ./server/ ./dist/server/
#chmod -R a+x ./dist/bin/
#cp -R ./node_modules/ ./dist/node_modules/

if [[ ! -d "./dist" ]]; then
    mkdir ./dist
fi

for file in ./*
do
    if [[ -f $file ]] && ([[ "$file" == *package.json ]] || [[ "$file" == *Config.js ]] && [[ "$file" != *build.sh ]])
    then
        cp $file ./dist/
    elif [[ -d $file ]] && [[ "$file" != "./dist" ]] && [[ "$file" != "./node_modules" ]]
    then
        if [[ -d ./dist/$file ]]
        then
            rm -rf ./dist/$file
        fi
        cp -R $file/ ./dist/$file
    fi
done
chmod -R a+x ./dist/bin/
cd ./dist/ && npm install --only=prod

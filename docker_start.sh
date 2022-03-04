starttime=$(node -e "console.log(new Date().getTime());")

docker build -t dronelab-ui .

endtime=$(node -e "console.log(new Date().getTime());")
build_time=$(node -e "console.log(($endtime-$starttime)/1000);")
printf "$build_time sec\n"

docker run --rm -it -p 8080:8080 dronelab-ui
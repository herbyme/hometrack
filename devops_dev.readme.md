devops/dev role readme

create a new free aws account (that you can share the root password with us)

create within the sydney region

complete the codetest https://github.com/Hometrack/codetest

instead of hosting the result in heroku, host it in the new aws account you created

you are free to setup the environment how you wish but it must be highly available (HA) across at least 2 availability zones (AZ) and
should be able to recover from us going in and deleting the application server from one AZ and then the other 5 minutes 
later with zero downtime

obviously you cannot set up every best practise in a short test period, so you should also include an "improvements.txt" file noting all 
the extra things you would implement in a production setup

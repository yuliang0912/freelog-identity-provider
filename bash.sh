
docker stop freelog-identity-provider
docker rm freelog-identity-provider
docker rmi freelog-identity-provider
cd /d/工作/freelog-identity-provider
docker build -t freelog-identity-provider .
docker run --name="freelog-identity-provider" -p 7011:7011  freelog-identity-provider

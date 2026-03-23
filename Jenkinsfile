pipeline {

    agent any 

    environment {
        VERCEL_HOOK_URL = credentials('vercel-hooks-url')
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Install Dependencies') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop' }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop' }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Sonar') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=jeyzdev_store-mate-app \
                        -Dsonar.organization=jeyzdev \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=https://sonarcloud.io \
                        -Dsonar.token=$SONAR_TOKEN \
                        -Dsonar.javascript.node.maxspace=512 \
                        -Dsonar.exclusions=**/node_modules/**,**/dist/**
                        '''
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop' }
            }
            steps {
                sh '''
                if [ -z "$VERCEL_HOOK_URL" ]; then
                  echo "VERCEL_HOOK_URL is empty!"
                  exit 1
                fi

                curl -X POST "$VERCEL_HOOK_URL"
                '''
            }
        }
    }

    post { 
        always { 
            cleanWs() 
        } 
    }
}
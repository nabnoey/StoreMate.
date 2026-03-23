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
            when {
                expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop' }
            }
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        sh '''
                        set -x
                        echo "START SONAR"

                        sonar-scanner \
                          -Dsonar.projectKey=jeyzdev_store-mate-app \
                          -Dsonar.organization=jeyzdev \
                          -Dsonar.sources=src \
                          -Dsonar.host.url=https://sonarcloud.io \
                          -Dsonar.login=$SONAR_TOKEN

                        echo "END SONAR"
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
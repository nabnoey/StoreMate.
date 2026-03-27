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
                sh 'npm ci'
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
                        sonar-scanner \
                          -Dsonar.projectKey=jeyzdev_store-mate-app \
                          -Dsonar.organization=jeyzdev \
                          -Dsonar.sources=src \
                          -Dsonar.host.url=https://sonarcloud.io \
                          -Dsonar.token=$SONAR_TOKEN \
                          -Dsonar.coverage.exclusions=** \
                          -Dsonar.javascript.node.maxspace=2048 \
                          -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/*.spec.ts,**/*.test.ts
                        '''
                    }
                }
            }
        }

        stage('Build (Optional)') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop' }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            when {
                expression { env.GIT_BRANCH == 'origin/develop' || env.GIT_BRANCH == 'develop' }
            }
            steps {
                sh '''
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
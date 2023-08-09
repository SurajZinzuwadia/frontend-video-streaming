
pipeline
{

	agent any

	environment {
		DOCKERHUB_CREDENTIALS=credentials('vss-docker-key')
	}

	stages 
    {
        stage('Cleanup') {
            steps {
                script {
                    def runningContainers = sh(script: 'docker ps -q', returnStdout: true).trim().split('\n')
                    for (def containerId in runningContainers) {
                        sh "docker stop ${containerId}"
                        sh "docker rm ${containerId}"
                    }
                    sh 'yes | docker system prune -a'
                    def imagesToDelete = sh(script: 'docker images -q', returnStdout: true).trim()
                    if (imagesToDelete) {
                        sh "docker rmi -f ${imagesToDelete}"
                    }
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t krishnap1999/video-streaming-platform:latest .'
                    sh 'docker tag krishnap1999/video-streaming-platform:latest krishnap1999/video-streaming-platform:frontend'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t krishnap1999/video-streaming-platform:latest .'
                    sh 'docker tag krishnap1999/video-streaming-platform:latest krishnap1999/video-streaming-platform:backend'
                }
            }
        }
        
        stage('Build database') {
            steps {
                dir('database') {
                    sh 'docker build -t krishnap1999/video-streaming-platform:latest .'
                    sh 'docker tag krishnap1999/video-streaming-platform:latest krishnap1999/video-streaming-platform:database'
                }
            }
        }

        stage('push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'vss-docker-key', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR')]) {
                    sh 'docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW'
                    sh 'docker push krishnap1999/video-streaming-platform:frontend'
                    sh 'docker push krishnap1999/video-streaming-platform:database'
                    sh 'docker push krishnap1999/video-streaming-platform:backend'
                }
            }
        }

        stage('Deploy') {
                steps {
                    sh 'docker-compose -f docker-compose.yaml down'
                    sh 'docker-compose -f docker-compose.yaml up -d'
                    sh 'docker-compose ps'
                }
            }
    }

        post {
            always {
                sh 'docker logout'
            }
        }
}
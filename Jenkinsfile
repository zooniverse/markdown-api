#!groovy

pipeline {
  agent none

  options {
    quietPeriod(120)
    disableConcurrentBuilds()
  }

  stages {

    stage('Build Docker image') {
      agent any
      steps {
        script {
          def dockerRepoName = 'zooniverse/markdown-api'
          def dockerImageName = "${dockerRepoName}:${GIT_COMMIT}"
          def newImage = docker.build(dockerImageName)
          newImage.push()

          if (BRANCH_NAME == 'master') {
            stage('Update latest tag') {
              newImage.push('latest')
            }
          }
        }
      }
    }

    stage('Dry run deployments') {
      agent any
      steps {
        sh "sed 's/__IMAGE_TAG__/${GIT_COMMIT}/g' kubernetes/deployment.tmpl | kubectl --context azure apply --dry-run=client --record -f -"
      }
    }

    stage('Deploy to Kubernetes') {
      when { tag 'master' }
      agent any
      steps {
        sh "sed 's/__IMAGE_TAG__/${GIT_COMMIT}/g' kubernetes/deployment.tmpl | kubectl --context azure apply --record -f -"
      }
      post {
        success {
          script {
            if (env.TAG_NAME == 'master') {
              slackSend (
                color: '#00FF00',
                message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})",
                channel: "#ops"
              )
            }
          }
        }

        failure {
          script {
            if (env.TAG_NAME == 'master') {
              slackSend (
                color: '#FF0000',
                message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})",
                channel: "#ops"
              )
            }
          }
        }
      }
    }
  }
}
